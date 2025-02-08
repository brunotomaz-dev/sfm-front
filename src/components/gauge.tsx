import ReactECharts from 'echarts-for-react';
import React from 'react';
import { ColorsSTM, IndicatorType } from '../helpers/constants';

type Position = 'top' | 'bottom' | 'center' | 'up-center' | 'down-center';

interface GaugeProps {
  indicator: IndicatorType;
  data: number;
  large?: boolean;
  pos?: Position;
}

const GaugeChart: React.FC<GaugeProps> = ({ indicator, data, large = false, pos = 'up-center' }) => {
  // Opções de cores do gauge conforme o indicador
  const optColor = {
    [IndicatorType.PERFORMANCE]: [
      [0.1, ColorsSTM.GREEN],
      [1, ColorsSTM.RED],
    ],
    [IndicatorType.REPAIR]: [
      [0.1, ColorsSTM.GREEN],
      [1, ColorsSTM.RED],
    ],
    [IndicatorType.EFFICIENCY]: [
      [0.899, ColorsSTM.RED],
      [1, ColorsSTM.GREEN],
    ],
  };

  // Opção de Altura do gauge
  const position_y = {
    top: '35%',
    bottom: '65%',
    center: '50%',
    'up-center': '46%',
    'down-center': '55%',
  };

  // Arredondar o valor de data para 2 casas decimais
  data = Math.round(data * 100) / 100;

  // Configurações do gauge
  const option = {
    textStyle: {
      fontFamily: 'Poppins',
    },
    tooltip: {
      formatter: '{b} : {c}%',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 10,
    },
    series: [
      {
        title: {
          offsetCenter: [0, '110%'],
          fontSize: 20,
          color: 'auto',
          fontWeight: 'bold',
          fontFamily: 'Poppins',
        },
        type: 'gauge',
        startAngle: 220,
        endAngle: -40,
        min: 0,
        max: indicator === IndicatorType.EFFICIENCY ? 100 : 40,
        center: ['50%', position_y[pos]],
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            color: optColor[indicator],
            width: 15,
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowBlur: 10,
          },
        },
        pointer: {
          width: 4,
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          length: 4,
          distance: -15,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        splitLine: {
          length: 15,
          distance: -15,
          width: 2,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        axisLabel: {
          color: 'auto',
          fontSize: 10,
          distance: -15,
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '70%'],
          valueAnimation: true,
          formatter: function (value: number) {
            return Math.round(value) + '%';
          },
          color: 'auto',
        },
        data: [
          {
            value: data,
            name: indicator === IndicatorType.EFFICIENCY ? 'EFICIÊNCIA' : indicator.toUpperCase(),
          },
        ],
      },
    ],
  };

  const size = large ? { height: '250%', width: '200%' } : { height: '200%', width: '100%' };

  return <ReactECharts option={option} style={size} opts={{ renderer: 'canvas' }} />;
};

export default GaugeChart;
