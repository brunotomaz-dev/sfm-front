import EChartsReact from 'echarts-for-react';
import React, { useMemo } from 'react';
import { Row } from 'react-bootstrap';
import { BSColors } from '../../../helpers/constants';
import { iInfoIhmLive } from '../interfaces/infoIhm';

interface BarStopsProps {
  data: iInfoIhmLive[];
}

interface StopSummary {
  motivo: string;
  problema: string;
  causa: string;
  tempo: number;
  impacto: number;
}

const BarStops: React.FC<BarStopsProps> = ({ data }) => {
  // Tempo total de paradas
  const totalStopTime = useMemo(() => {
    return data.filter((item) => item.status === 'parada').reduce((acc, item) => acc + item.tempo, 0);
  }, [data]);

  const stopSummary = useMemo(() => {
    // Filtra e agrupa os dados por causa
    const stops = data
      .filter((item) => item.status === 'parada')
      .reduce(
        (acc, item) => {
          const key = `${item.motivo}-${item.problema}-${item.causa}`;

          if (!acc[key]) {
            acc[key] = {
              motivo: item.motivo || 'N/A',
              problema: item.problema || 'N/A',
              causa: item.causa || 'N/A',
              tempo: 0,
              impacto: 0,
            };
          }

          acc[key].tempo += item.tempo;
          return acc;
        },
        {} as Record<string, StopSummary>
      );

    // Converte para array e calcula o impacto
    return Object.values(stops)
      .map((item) => ({
        ...item,
        impacto: parseFloat(((item.tempo / totalStopTime) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.tempo - a.tempo);
  }, [data]);

  // Options para echart de barra
  const option = {
    title: {
      text: 'Paradas (Tempo e Impacto)',
      left: 'center',
      textStyle: {
        fontSize: 14,
      },
    },
    textStyle: {
      fontFamily: 'Poppins',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const item = stopSummary[params[0].dataIndex];
        return `
          <strong>${item.motivo}</strong><br/>
          Problema: ${item.problema}<br/>
          Causa: ${item.causa}<br/>
          Tempo: ${item.tempo} min<br/>
          Impacto: ${item.impacto}%
        `;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: 'Tempo (min)',
      nameLocation: 'center',
      nameGap: 25,
    },
    yAxis: {
      type: 'category',
      data: stopSummary.map((item) => `${item.motivo} - ${item.problema} - ${item.causa}`),
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: 'Tempo',
        type: 'bar',
        itemStyle: {
          color: BSColors.GREY_500_COLOR,
        },
        label: {
          show: true,
          position: 'insideLeft',
          distance: 5,
          formatter: (params: any) => {
            const item = stopSummary[params.dataIndex];
            return item.causa;
          },
          align: 'left',
          verticalAlign: 'middle',
        },
        emphasis: {
          focus: 'series',
        },
        data: stopSummary.map((item) => item.tempo),
      },
    ],
  };

  return (
    <>
      {totalStopTime > 0 ? (
        <EChartsReact option={option} style={{ height: '100%', width: '100%' }} />
      ) : (
        <Row className='align-items-center text-center h-100'>
          <h5>Não há paradas registradas</h5>
        </Row>
      )}
    </>
  );
};

export default BarStops;
