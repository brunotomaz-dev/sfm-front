import { format, parseISO, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getHourProduction } from '../api/apiRequests';
import ProductionLiveTable from '../components/productionLive.table';
import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';
import '../styles/datePicker.css';

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
  const now = startOfDay(new Date());
  const nowDate = format(now, 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState<string>(nowDate);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    // Faz a requisição
    void getHourProduction(selectedDate)
      .then((data: ProductionData[]) => {
        setProdHour(
          data.map((item) => ({
            ...item,
            linha: MaqLine[item.maquina_id],
          }))
        );
      })
      .catch((err: Error) => {
        setError(err.message);
        setProdHour([]);
      });
  }, [selectedDate, MaqLine]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(startOfDay(date), 'yyyy-MM-dd');
      setSelectedDate(formattedDate);
    }
  };
  /* -------------------------------------------------------------------------------------------------------- */
  /*                                                  layout                                                  */
  /* -------------------------------------------------------------------------------------------------------- */
  return (
    <main className={`p-2 w-100 main-content ${isCollapsed ? 'collapsed' : ''}`}>
      <h1 className="text-center p-2">Caixas produzidas por hora</h1>
      <div className="d-flex justify-content-between mb-2 ms-3">
        <DatePicker
          selected={parseISO(selectedDate)}
          onChange={(date: Date | null) => handleDateChange(date)}
          dateFormat="dd/MM/yyyy"
          className="form-control text-center "
          calendarIconClassName="mr-2"
          icon={'bi bi-calendar'}
          showIcon={true}
          // withPortal={true}
          popperClassName="custom-popper"
          calendarClassName="custom-calendar"
          locale={ptBR}
          minDate={parseISO('2024-08-01')}
          maxDate={now}
        />
      </div>
      {!error ? (
        <ProductionLiveTable data={prodHour} />
      ) : (
        <div className="alert alert-warning text-center" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
    </main>
  );
};

export default ProductionLive;
