import { format, startOfDay } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Card, Row, Table } from 'react-bootstrap';
import { getCarrinhosCount } from '../api/apiRequests';
import { iCartCount } from '../interfaces/Carrinhos.interface';

const HomeCartCountCart: React.FC = () => {
  // Encontrar primeiro dia do mês
  const now = startOfDay(new Date());
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayString = format(firstDay, 'yyyy-MM-dd');
  // Ajustar o dia atual para o formato yyyy-mm-dd
  const nowString = format(now, 'yyyy-MM-dd');

  //Inicializar estado local
  const [cartCount, setCartCount] = useState<iCartCount[]>([]);

  useEffect(() => {
    // Faz a requisição do indicador e salva no estado
    void getCarrinhosCount(nowString, nowString).then((data: iCartCount[]) => setCartCount(data));
  }, [firstDayString, nowString]);

  return (
    <Card className="shadow border-0 p-3 mb-2">
      <h3>Carrinhos Produzidos</h3>
      <Row>
        <Table striped responsive>
          <thead>
            <tr>
              <th>Data</th>
              <th className="text-end">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {cartCount.map(({ Turno, Contagem_Carrinhos, Data_apontamento }) => (
              <tr key={Turno + Data_apontamento}>
                <td>{Turno}</td>
                <td className="text-end">{Contagem_Carrinhos.toLocaleString('pt-BR')}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td className="text-end">
                <strong>
                  {cartCount.reduce((acc, curr) => acc + curr.Contagem_Carrinhos, 0).toLocaleString('pt-BR')}
                </strong>
              </td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </Card>
  );
};

export default HomeCartCountCart;
