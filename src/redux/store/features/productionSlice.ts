import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface iProductionData {
  data_registro: string;
  produto: string;
  turno: string;
  total_produzido: number;
}

interface ProductionState {
  currentMonthProduction: iProductionData[];
}

const initialState: ProductionState = {
  currentMonthProduction: [],
};

export const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    setCurrentMonthProduction: (state, action: PayloadAction<iProductionData[]>) => {
      state.currentMonthProduction = action.payload;
    },
  },
});

export const { setCurrentMonthProduction } = productionSlice.actions;
export default productionSlice.reducer;