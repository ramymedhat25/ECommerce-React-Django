import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiURL";
import { STATUS } from "../utils/status";

const initialState = {
  searchProducts: [],
  searchProductsStatus: STATUS.IDLE,
};

export const fetchAsyncSearchProduct = createAsyncThunk(
  "search/fetch",
  async (searchTerm) => {
    try {
      const response = await fetch(`${BASE_URL}search?q=${searchTerm}`);
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      throw new Error("Failed to fetch search results");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state, action) => {
      state.searchProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncSearchProduct.pending, (state, action) => {
        state.searchProductsStatus = STATUS.LOADING;
      })

      .addCase(fetchAsyncSearchProduct.fulfilled, (state, action) => {
        state.searchProducts = action.payload;
        state.searchProductsStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchAsyncSearchProduct.rejected, (state, action) => {
        state.searchProducts = [];
        state.searchProductsStatus = STATUS.FAILED;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export const getSearchProducts = (state) => state.search.searchProducts;
export const getSearchProductsStatus = (state) =>
  state.search.searchProductsStatus;
export default searchSlice.reducer;
