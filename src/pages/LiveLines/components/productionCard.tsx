import React from 'react';

interface ProductionPanelProps {
  productionTotal: number;
  produto: string;
}

const ProductionPanel: React.FC<ProductionPanelProps> = ({
  productionTotal,
  produto
}) => {
  return (
    <>
      <p>Produção</p>
      <h1 className="text-center">{productionTotal}</h1>
      <p>Produto</p>
      <h4 className="text-center">{produto}</h4>
    </>
  );
};

export default ProductionPanel;