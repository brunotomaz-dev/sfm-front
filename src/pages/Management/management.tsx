import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import PageLayout from '../../components/pageLayout';
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
      <Card>Linha com a produção total do mês (período)</Card>
    </PageLayout>
  );
};

export default Management;
