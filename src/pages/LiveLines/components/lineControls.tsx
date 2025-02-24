import React from 'react';
import { FormSelect, Row } from 'react-bootstrap';
import MachineStatus from './lineStatus';

interface ControlsProps {
  selectedLine: number;
  selectedShift: string;
  lines: number[];
  turnos: Record<string, string>;
  shiftOptions: string[];
  onLineChange: (line: number) => void;
  onShiftChange: (shift: string) => void;
  cardStyle: React.CSSProperties;
  status: string;
  statusRender: boolean;
}

const LineControls: React.FC<ControlsProps> = ({
  selectedLine,
  selectedShift,
  lines,
  turnos,
  shiftOptions,
  onLineChange,
  onShiftChange,
  cardStyle,
  status,
  statusRender,
}) => {
  return (
    <>
      <Row className='mb-3'>
        <FormSelect
          value={selectedLine}
          className='bg-light p-4 shadow text-center'
          style={cardStyle}
          onChange={(e) => onLineChange(Number(e.target.value))}
        >
          {lines.map((line) => (
            <option style={{ fontSize: '1vw' }} key={line} value={line}>
              {`Linha ${line}`}
            </option>
          ))}
        </FormSelect>
      </Row>
      <Row className='mb-3'>
        <FormSelect
          value={selectedShift}
          className='bg-light p-4 shadow text-center'
          style={cardStyle}
          onChange={(e) => onShiftChange(e.target.value)}
        >
          {shiftOptions.map((shift) => (
            <option style={{ fontSize: '1vw' }} key={shift} value={shift}>
              {turnos[shift]}
            </option>
          ))}
        </FormSelect>
      </Row>
      {statusRender && <MachineStatus status={status} />}
      <Row className='card text-center bg-warning mb-3'>Problema - Em Construção</Row>
      <Row className='card text-center bg-light p-3'>Tempo Parada - Em Construção</Row>
    </>
  );
};

export default LineControls;
