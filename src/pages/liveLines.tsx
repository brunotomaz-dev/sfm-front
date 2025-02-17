import { format, parseISO, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useEffect, useMemo, useState } from 'react';
import { Col, FormSelect, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { getIndicator } from '../api/apiRequests';
import GaugeChart from '../components/gauge';
import { IndicatorType } from '../helpers/constants';
import { getShift } from '../helpers/turn';
import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';

type tShiftOptions = 'NOT' | 'MAT' | 'VES' | 'DEFAULT';
type IndicatorKey = 'eficiencia' | 'performance' | 'reparo';
type SetStateFunction = (value: number) => void;

interface iIndicator {
  linha: number;
  turno: string;
  data_registro: string;
}

interface iEff extends iIndicator {
  total_produzido: number;
  eficiencia: number;
}

interface iRep extends iIndicator {
  reparo: number;
}

interface iPerf extends iIndicator {
  performance: number;
}

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
  const isCollapsed = useAppSelector((state: RootState) => state.sidebar.isCollapsed);
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

  // Mudança de turno
  const handleShiftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedShift(e.target.value);
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
  useEffect(() => {
    // Indicador de eficiência
    void getIndicator(IndicatorType.EFFICIENCY, selectedDate, [
      'linha',
      'turno',
      'data_registro',
      'total_produzido',
      'eficiencia',
    ]).then((data: iEff[]) => {
      setEffData(data);
    });
    // Indicador de performance
    void getIndicator(IndicatorType.PERFORMANCE, selectedDate, ['linha', 'turno', 'data_registro', 'performance']).then(
      (data: iPerf[]) => {
        setPerfData(data);
      }
    );
    // Indicador de reparo
    void getIndicator('repair', selectedDate, ['linha', 'turno', 'data_registro', 'reparo']).then((data: iRep[]) => {
      setRepData(data);
    });
  }, [selectedDate]);

  // Setar os valores dos indicadores
  useEffect(() => {
    const eficienciaFiltered = filterData(effData);

    calculateAverage(eficienciaFiltered, 'eficiencia', setEficiencia);
    calculateAverage(filterData(perfData), 'performance', setPerformance);
    calculateAverage(filterData(repData), 'reparo', setReparos);
    setProductionTotal(eficienciaFiltered.reduce((acc, curr) => acc + curr.total_produzido, 0));
  }, [effData, perfData, repData, filterData]);

  /* -------------------------------------------------------------------------------------------------------- */
  /*                                                  Layout                                                  */
  /* -------------------------------------------------------------------------------------------------------- */
  return (
    <main className={`p-2 w-100 main-content ${isCollapsed ? 'collapsed' : ''}`}>
      <h1 className="text-center">{selectedDate === nowDate ? 'Linhas em Tempo Real' : 'Linhas Histórico'}</h1>
      <Row className="d-flex justify-content-between m-2">
        <Col>
          <DatePicker
            selected={parseISO(selectedDate)}
            className="form-control text-center"
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            icon="bi bi-calendar-day"
            popperClassName="custom-popper"
            calendarClassName="custom-calendar"
            showIcon={true}
            onChange={(date: Date | null) => handleDateChange(date)}
            minDate={parseISO('2024-11-01')}
            maxDate={now}
          />
        </Col>
      </Row>
      <Row className="m-2 gap-1">
        {/* Coluna dos gauges */}
        <Col xs={12} xl={5} className="card bg-transparent shadow d-flex justify-content-center border-0 mb-lg-0 mb-2">
          <Row>
            <Col xs={12} sm className="card bg-transparent align-items-center border-0" style={{ height: '200px' }}>
              <GaugeChart indicator={IndicatorType.EFFICIENCY} data={eficiencia} trio={true} />
            </Col>
            <Col xs={12} sm className="card bg-transparent align-items-center border-0" style={{ height: '200px' }}>
              <GaugeChart indicator={IndicatorType.PERFORMANCE} data={performance} trio={true} />
            </Col>
            <Col xs={12} sm className="card bg-transparent align-items-center border-0" style={{ height: '200px' }}>
              <GaugeChart indicator={IndicatorType.REPAIR} data={reparos} trio={true} />
            </Col>
          </Row>
        </Col>
        {/* Coluna de produção */}
        <Col xs={3} xl={2} className="card bg-transparent p-2 shadow mb-lg-0 mb-2 fs-responsive">
          <p>Produção</p>
          <h1 className="text-center">{productionTotal}</h1>
          <p>Produto</p>
          <h2 className="text-center">Produto Descrito Aqui</h2>
        </Col>
        {/* Coluna de barras */}
        <Col xs={5} xl className="card p-2 shadow mb-lg-0 mb-2">
          Barras
        </Col>
        {/* Coluna comparação */}
        <Col xs xl className="card shadow mb-lg-0 mb-2">
          <Row className="d-flex justify-content-center">
            <Col className="card shadow d-flex justify-content-between">
              <Row className="card bg-danger text-light text-center">Eff Ontem</Row>
              <Row className="card bg-danger text-light text-center">Perf Ontem</Row>
              <Row className="card bg-success text-light text-center">Rep Ontem</Row>
            </Col>
            <Col className="card shadow d-flex justify-content-between">
              <Row className="card bg-success text-light text-center">Eff Hoje</Row>
              <Row className="card bg-success text-light text-center">Perf Hoje</Row>
              <Row className="card bg-danger text-light text-center">Rep Hoje</Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center m-2 gap-1 bg-success-subtle">
        <Col className="card bg-transparent d-flex justify-content-between">
          <Row className="card text-center bg-success mb-3">Status</Row>
          <Row className="mb-3">
            <FormSelect
              value={selectedLine}
              className="bg-light p-4 shadow text-center"
              style={cardStyle}
              onChange={(e) => setSelectedLine(Number(e.target.value))}
            >
              {lines.map((line) => (
                <option style={{ fontSize: '1vw' }} key={line} value={line}>
                  {`Linha ${line}`}
                </option>
              ))}
            </FormSelect>
          </Row>
          <Row className="mb-3">
            <FormSelect
              value={selectedShift}
              className="bg-light p-4 shadow text-center"
              style={cardStyle}
              onChange={handleShiftChange}
            >
              {handleShiftOptions.map((shift) => (
                <option style={{ fontSize: '1vw' }} key={shift} value={shift}>
                  {turnos[shift as keyof typeof turnos]}
                </option>
              ))}
            </FormSelect>
          </Row>
          <Row className="card text-center bg-warning">Problema</Row>
        </Col>
        <Col className="card p-2 shadow col-8">Charts</Col>
        <Col className="card p-2 shadow">Tempos</Col>
      </Row>
    </main>
  );
};

export default LiveLines;
