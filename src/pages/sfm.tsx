import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';

const ShopFloor: React.FC = () => {
  const isCollapsed = useAppSelector((state: RootState) => state.sidebar.isCollapsed);
  return (
    <main className={`p-2 w-100 main-content ${isCollapsed ? 'collapsed' : ''}`}>
      <h1 className="text-center">Shop Floor Management</h1>
      <section>
        <Row>
          <h2>Eficiência</h2>
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
