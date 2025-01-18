import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getIndicator } from '../api/apiRequests';
import GaugeChart from '../components/gauge';
import HomeCartCountCart from '../components/home.cartCount';
import HomeEstoqueCard from '../components/home.estoque';
import HomeLinesCard from '../components/home.lines';
import HomeProductionCard from '../components/home.production';
import { IndicatorType } from '../helpers/constants';
import { iEficiencia, iPerformance, iRepair } from '../interfaces/Indicators.interfaces';
import { setLineMachine } from '../redux/store/features/homeSlice';
import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';

//cSpell: words eficiencia

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const fullName = useAppSelector((state: RootState) => state.user.fullName);
  const isCollapsed = useAppSelector((state: RootState) => state.sidebar.isCollapsed);
  const [eficiencia, setEficiencia] = useState<iEficiencia[]>([]);
  const [performance, setPerformance] = useState<iPerformance[]>([]);
  const [repairs, setRepairs] = useState<iRepair[]>([]);

  // Conseguir a data de hoje
  const now = new Date();

  //Deixar a data no formato yyyy-mm-dd
  const nowDate = now.toISOString().split('T')[0];

  // Conseguir a média de eficiencia
  const eficienciaMedia =
    eficiencia.length > 0 ? eficiencia.reduce((acc, curr) => acc + curr.eficiencia, 0) / eficiencia.length : 0;

  const performanceMedia =
    performance.length > 0 ? performance.reduce((acc, curr) => acc + curr.performance, 0) / performance.length : 0;

  const repairsMedia = repairs.length > 0 ? repairs.reduce((acc, curr) => acc + curr.reparo, 0) / repairs.length : 0;

  useEffect(() => {
    // Faz a requisição do indicador e salva no estado
    void getIndicator('eficiencia', nowDate).then((data: iEficiencia[]) => setEficiencia(data));
    void getIndicator('performance', nowDate).then((data: iPerformance[]) => setPerformance(data));
    void getIndicator('repair', nowDate).then((data: iRepair[]) => setRepairs(data));
  }, [nowDate]);

  useEffect(() => {
    const lineMachine = eficiencia.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.maquina_id] = curr.linha;
      return acc;
    }, {});

    dispatch(setLineMachine(lineMachine));
  }, [eficiencia, dispatch]);

  return (
    <>
      <main className={`p-2 w-100 main-content ${isCollapsed ? 'collapsed' : ''}`}>
        <h3>Olá, {fullName}</h3>
        <p>Seja bem-vindo ao sistema de gestão de produção da Santa Massa</p>
        <h1 className="text-center p-2">Dados do dia</h1>
        <section className="container-fluid">
          <Row className="row">
            <Col className="col-7">
              <Card className="bg-transparent shadow border-0 p-2 pb-4">
                <h4 className="card-title text-center p-2">Indicadores de eficiência</h4>
                <div className="d-flex flex-row justify-content-center align-items-center">
                  <GaugeChart indicator={IndicatorType.EFFICIENCY} data={eficienciaMedia * 100} large pos="up-center" />
                  <GaugeChart
                    indicator={IndicatorType.PERFORMANCE}
                    data={performanceMedia * 100}
                    large
                    pos="down-center"
                  />
                  <GaugeChart indicator={IndicatorType.REPAIR} data={repairsMedia * 100} large pos="up-center" />
                </div>
              </Card>
            </Col>
            <Col>
              <h1 className="border border-primary rounded p-2">Absenteísmo</h1>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <HomeProductionCard />
              <HomeCartCountCart />
            </Col>
            <Col>
              <HomeLinesCard />
            </Col>
            <Col>
              <HomeEstoqueCard />
            </Col>
          </Row>
        </section>
      </main>
    </>
  );
};

export default Home;
