import React, { useState } from 'react';
import PageLayout from '../../components/pageLayout';
import MonthProdCardsMNT from './components/monthProduction.Management';
import TodayProductionCards from './components/todayProductionCard';

const Management: React.FC = () => {
  /* ------------------------------------------------- DATAS ------------------------------------------------ */
  // Hoje
  const today = new Date();
  // Primeiro dia do mês
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  /* -------------------------------------- INICIALIZAR ESTADOS LOCAIS -------------------------------------- */
  const [startDate, setStartDate] = useState<Date>(firstDay);
  const [endDate, setEndDate] = useState<Date>(today);

  /* -------------------------------------------------------------------------------------------------------- */
  /*                                                  Layout                                                  */
  /* -------------------------------------------------------------------------------------------------------- */
  return (
    <PageLayout>
      <h1 className='text-center p-2'>Gestão de Produção</h1>
      <TodayProductionCards today={today} />
      <MonthProdCardsMNT firstDay={firstDay} />
    </PageLayout>
  );
};

export default Management;
