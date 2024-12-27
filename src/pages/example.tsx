import React from 'react';
import { increment } from '../redux/store/features/homeSlice';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';

const HomeFake: React.FC = () => {
  // Criar um contador simples com um botão de incremento e usando o state do store do Redux
  const dispatch = useAppDispatch();
  const storeCount = useAppSelector((state: { home: { count: number } }) => state.home.count);

  const incrementCount = () => {
    dispatch(increment());
  };

  return (
    <>
      <main className="p-2 w-100">
        <h1>Count Page</h1>
        <p>Store Count: {storeCount}</p>
        <button onClick={incrementCount}>Increment</button>
      </main>
    </>
  );
};

export default HomeFake;
