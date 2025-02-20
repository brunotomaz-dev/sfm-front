import React from 'react';
import { Col, Row } from 'react-bootstrap';
import GaugeChart from '../../../components/gauge';
import { IndicatorType } from '../../../helpers/constants';

interface IndicatorsProps {
  eficiencia: number;
  performance: number;
  reparos: number;
}

const LineIndicators: React.FC<IndicatorsProps> = ({
  eficiencia,
  performance, 
  reparos
}) => {
  return ( 
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
  );
};

export default LineIndicators;