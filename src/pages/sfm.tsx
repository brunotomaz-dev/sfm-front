import React from 'react';
import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';

const ShopFloor: React.FC = () => {
  const isCollapsed = useAppSelector((state: RootState) => state.sidebar.isCollapsed);
  return (
    <main className={`p-2 w-100 main-content ${isCollapsed ? 'collapsed' : ''}`}>
      <h1>Shop Floor Management</h1>
    </main>
  );
};

export default ShopFloor;
