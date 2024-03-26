import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filteredProducts: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setPriceFilter: (state, action) => {
      // Logic to set price filter
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
  },
});

export const { setPriceFilter, setFilteredProducts } = filterSlice.actions;
export const getFilteredProducts = state => state.filter.filteredProducts;

export default filterSlice.reducer;
