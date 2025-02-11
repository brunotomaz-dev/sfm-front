import React, { useEffect, useState } from 'react';
import { getHourProduction } from '../api/apiRequests';
import ProductionLiveTable from '../components/productionLive.table';
import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';

interface ProductionData {
  maquina_id: string;
  intervalo: string;
  total: number;
  linha?: number;
}

const ProductionLive: React.FC = () => {
  const isCollapsed = useAppSelector((state: RootState) => state.sidebar.isCollapsed);
  const MaqLine = useAppSelector((state: RootState) => state.home.lineMachine);
  const [prodHour, setProdHour] = useState<ProductionData[]>([]);
  const now = new Date();
  const nowDate = now.toISOString().split('T')[0];

  useEffect(() => {
    // Faz a requisição
    void getHourProduction(nowDate).then((data: ProductionData[]) => {
      setProdHour(
        data.map((item) => ({
          ...item,
          linha: MaqLine[item.maquina_id],
        }))
      );
    });
  }, [nowDate, MaqLine]);

  /* -------------------------------------------------------------------------------------------------------- */
  /*                                                  layout                                                  */
  /* -------------------------------------------------------------------------------------------------------- */
  return (
    <main className={`p-2 w-100 main-content ${isCollapsed ? 'collapsed' : ''}`}>
      <h1 className="text-center p-2">Caixas produzidas por hora</h1>
      <ProductionLiveTable data={prodHour} />
    </main>
  );
};

export default ProductionLive;
