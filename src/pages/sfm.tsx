import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import GaugeChart from '../components/gauge';
import { IndicatorType } from '../helpers/constants';
import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';

const ShopFloor: React.FC = () => {
  const isCollapsed = useAppSelector((state: RootState) => state.sidebar.isCollapsed);
  // NOTE: Remover a função temporária após a implementação da API
  // Função temporária que gera um número aleatório entre 0 e 100 a cada 10 segundos
  const [randomIndicator, setRandomIndicator] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 100);
      setRandomIndicator(random);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={`p-2 w-100 main-content ${isCollapsed ? 'collapsed' : ''}`}>
      <h1 className="text-center">Shop Floor Management</h1>
      <section>
        <Row>
          <h3 className="text-center">Eficiência</h3>
          <Col>
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <div>
                <GaugeChart indicator={IndicatorType.EFFICIENCY} data={randomIndicator} />
              </div>
            </Card>
          </Col>
          <Col className="col-8">
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <p>Heatmap</p>
            </Card>
          </Col>
          <Col>
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <p>Gauge Hoje</p>
            </Card>
          </Col>
        </Row>
        <Row>
          <h2>Performance</h2>
          <Col>
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <p>Gauge Passado</p>
            </Card>
          </Col>
          <Col className="col-7">
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <p>Heatmap</p>
            </Card>
          </Col>
          <Col>
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <p>Gauge Hoje</p>
            </Card>
          </Col>
        </Row>
        <Row>
          <h2>Reparos</h2>
          <Col>
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <p>Gauge Passado</p>
            </Card>
          </Col>
          <Col className="col-7">
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <p>Heatmap</p>
            </Card>
          </Col>
          <Col>
            <Card className="shadow bg-transparent border-0 p-3 mb-2">
              <p>Gauge Hoje</p>
            </Card>
          </Col>
        </Row>
      </section>
    </main>
  );
};

export default ShopFloor;
