import React from 'react';
import { Row } from 'react-bootstrap';

interface ProductionPanelProps {
  productionTotal: number;
  produto: string;
}

const ProductionPanel: React.FC<ProductionPanelProps> = ({ productionTotal, produto }) => {
  return (
    <Row className='h-100 p-3 fs-responsive'>
      <p>Produção</p>
      <h1 className='text-center'>{productionTotal}</h1>
      <p>Produto</p>
      <h4 className='text-center'>{produto}</h4>
    </Row>
  );
};

export default ProductionPanel;
