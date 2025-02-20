import { format, startOfDay } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { getIndicator, getInfoIHM, getMaquinaInfo } from '../../api/apiRequests';
import PageLayout from '../../components/pageLayout';
import { IndicatorType } from '../../helpers/constants';
import { getShift } from '../../helpers/turn';
import useInterval from '../../hooks/useInterval';
import LineIndicators from './components/gauges';
import LiveLinesHeader from './components/header';
import LineControls from './components/lineControls';
import ProductionPanel from './components/productionCard';
import { iEff, iIndicator, iPerf, iRep } from './interfaces/indicator.interfaces';
import { iInfoIhmLive } from './interfaces/infoIhm';
import { iMaquinaInfo } from './interfaces/maquinaInfo.interface';

type tShiftOptions = 'NOT' | 'MAT' | 'VES' | 'DEFAULT';
type IndicatorKey = 'eficiencia' | 'performance' | 'reparo';
type SetStateFunction = (value: number) => void;

const LiveLines: React.FC = () => {
  /* ----------------------------------------------- VARIÁVEIS ---------------------------------------------- */
  const now = startOfDay(new Date());
  const nowDate = format(now, 'yyyy-MM-dd');
  const lines = Array.from({ length: 14 }, (_, i) => i + 1);
  const cardStyle = { borderRadius: '10px', fontSize: '1.5vw' };
  const shift = getShift();
  const turnos = {
    NOT: 'Noturno',
    MAT: 'Matutino',
    VES: 'Vespertino',
    TOT: 'Total',
  };

  /* -------------------------------------------- ESTADOS LOCAIS -------------------------------------------- */
  const [selectedDate, setSelectedDate] = useState<string>(nowDate);
  const [selectedLine, setSelectedLine] = useState<number>(1);
  const [selectedShift, setSelectedShift] = useState<string>(shift);
  const [effData, setEffData] = useState<iEff[]>([]);
  const [perfData, setPerfData] = useState<iPerf[]>([]);
  const [repData, setRepData] = useState<iRep[]>([]);
  const [eficiencia, setEficiencia] = useState<number>(0);
  const [performance, setPerformance] = useState<number>(0);
  const [reparos, setReparos] = useState<number>(0);
  const [productionTotal, setProductionTotal] = useState<number>(0);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [maquinaInfo, setMaquinaInfo] = useState<iMaquinaInfo[]>([]);
  const [infoIHM, setInfoIHM] = useState<iInfoIhmLive[]>([]);

  /* ------------------------------------------------ HANDLES ----------------------------------------------- */
  // Mudança de data
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(startOfDay(date), 'yyyy-MM-dd');
      setSelectedDate(formattedDate);
      if (formattedDate === nowDate) {
        setSelectedShift(shift);
      }
    }
  };

  // Opções de turno
  const handleShiftOptions = useMemo(() => {
    const opt: Record<tShiftOptions, string[]> = {
      NOT: ['NOT'],
      MAT: ['MAT', 'NOT'],
      VES: ['VES', 'MAT', 'NOT'],
      DEFAULT: ['TOT', 'NOT', 'MAT', 'VES'],
    };

    return selectedDate === nowDate ? opt[shift as keyof typeof opt] : opt.DEFAULT;
  }, [nowDate, selectedDate, shift]);

  // Filtro de dados
  const filterData = useMemo(() => {
    return <T extends iIndicator>(data: T[]): T[] => {
      if (selectedShift === 'TOT') {
        return data.filter((item) => item.linha === selectedLine);
      }
      return data.filter((item) => item.linha === selectedLine && item.turno === selectedShift);
    };
  }, [selectedLine, selectedShift]);

  // Média da eficiência
  const calculateAverage = <T extends { [K in IndicatorKey]?: number }>(
    data: T[],
    indicator: IndicatorKey,
    setState: SetStateFunction
  ): void => {
    const filteredData = data.filter((item) => typeof item[indicator] === 'number' && item[indicator] > 0);

    if (filteredData.length === 0) {
      setState(0);
      return;
    }

    const average = filteredData.reduce((acc, curr) => acc + (curr[indicator] ?? 0), 0) / filteredData.length;
    setState(indicator === 'reparo' ? average : average * 100);
  };

  /* ------------------------------------------ REQUISIÇÕES DA API ------------------------------------------ */
  const fetchIndicators = async () => {
    // Requisição de eficiência, performance e reparo
    const [effData, perfData, repData] = await Promise.all([
      getIndicator(IndicatorType.EFFICIENCY, selectedDate, [
        'linha',
        'maquina_id',
        'turno',
        'data_registro',
        'total_produzido',
        'eficiencia',
      ]),
      getIndicator(IndicatorType.PERFORMANCE, selectedDate, ['linha', 'turno', 'data_registro', 'performance']),
      getIndicator('repair', selectedDate, ['linha', 'turno', 'data_registro', 'reparo']),
    ]);
    // Setar os estados
    setEffData(effData);
    setPerfData(perfData);
    setRepData(repData);
  };

  // Requisição de indicadores
  useEffect(() => {
    void fetchIndicators();
  }, [selectedDate]);

  // Nova requisição em intervalo de 60s
  useInterval(
    () => {
      void fetchIndicators();
    },
    selectedDate === nowDate ? 60 * 1000 : null
  );

  // Setar os valores dos indicadores
  useEffect(() => {
    const eficienciaFiltered = filterData(effData);
    calculateAverage(eficienciaFiltered, 'eficiencia', setEficiencia);
    calculateAverage(filterData(perfData), 'performance', setPerformance);
    calculateAverage(filterData(repData), 'reparo', setReparos);
    setProductionTotal(eficienciaFiltered.reduce((acc, curr) => acc + curr.total_produzido, 0));
    setSelectedMachine(eficienciaFiltered[0]?.maquina_id ?? '');
  }, [effData, perfData, repData, filterData]);

  useEffect(() => {
    // Requisição de Maquina Info
    if (!selectedMachine) return;

    const params =
      selectedShift === 'TOT'
        ? { data: selectedDate, maquina_id: selectedMachine }
        : { data: selectedDate, turno: selectedShift, maquina_id: selectedMachine };

    void getMaquinaInfo(params, ['ciclo_1_min', 'hora_registro', 'produto', 'recno', 'status', 'tempo_parada']).then(
      (data: iMaquinaInfo[]) => {
        setMaquinaInfo(data);
      }
    );
  }, [selectedMachine, selectedDate, selectedShift]);

  // Requisição de info + ihm
  useEffect(() => {
    const params =
      selectedShift === 'TOT'
        ? { data: selectedDate, linha: selectedLine }
        : { data: selectedDate, linha: selectedLine, turno: selectedShift };

    void getInfoIHM(params, ['status', 'data_hora', 'data_hora_final', 'motivo', 'problema', 'causa', 'tempo']).then(
      (data) => {
        setInfoIHM(data);
      }
    );
  }, [selectedDate, selectedShift, selectedLine]);

  /* -------------------------------------------------------------------------------------------------------- */
  /*                                                  Layout                                                  */
  /* -------------------------------------------------------------------------------------------------------- */
  return (
    <PageLayout>
      <LiveLinesHeader
        selectedDate={selectedDate}
        nowDate={nowDate}
        selectedMachine={selectedMachine}
        onDateChange={handleDateChange}
      />
      <Row className='m-2 gap-1'>
        {/* ------------------------------------------- COLUNA DOS GAUGES ------------------------------------------ */}
        <Col xs={12} xl={5} className='card bg-transparent shadow d-flex justify-content-center border-0 mb-lg-0 mb-2'>
          <LineIndicators eficiencia={eficiencia} performance={performance} reparos={reparos} />
        </Col>
        {/* ------------------------------------------ COLUNA DA PRODUÇÃO ------------------------------------------ */}
        <Col xs={3} xl={2} className='card bg-transparent p-2 shadow mb-lg-0 mb-2 fs-responsive'>
          <ProductionPanel productionTotal={productionTotal} produto={maquinaInfo.at(-1)?.produto?.trim() || '-'} />
        </Col>
        {/* ------------------------------------------- COLUNA DE BARRAS ------------------------------------------- */}
        <Col xs={5} xl className='card p-2 shadow mb-lg-0 mb-2'>
          Barras - Em Construção
        </Col>
        {/* ----------------------------------------- COLUNA DE COMPARAÇÃO ----------------------------------------- */}
        <Col xs xl className='card shadow mb-lg-0 mb-2'>
          <Row className='d-flex justify-content-center'>Comparação entre eficiências - Em Construção</Row>
        </Col>
      </Row>
      <Row className='d-flex justify-content-center m-2 gap-1 bg-success-subtle'>
        {/* ----------------------------------------- COLUNA DOS CONTROLES ----------------------------------------- */}
        <Col className='card bg-transparent d-flex justify-content-between'>
          <LineControls
            selectedLine={selectedLine}
            selectedShift={selectedShift}
            lines={lines}
            turnos={turnos}
            shiftOptions={handleShiftOptions}
            onLineChange={setSelectedLine}
            onShiftChange={setSelectedShift}
            cardStyle={cardStyle}
            status={maquinaInfo.at(-1)?.status || '-'}
            statusRender={shift === selectedShift}
          />
        </Col>
        {/* ------------------------------- COLUNA DOS GRÁFICOS DE CICLOS E TIMELINE ------------------------------- */}
        <Col xs={12} xl={8} className='card p-2 shadow'>
          Charts - Em Construção
        </Col>
        {/* ------------------------------------------- COLUNA DE TEMPOS ------------------------------------------- */}
        <Col className='card p-2 shadow'>Tempos - Em Construção</Col>
      </Row>
    </PageLayout>
  );
};

export default LiveLines;
