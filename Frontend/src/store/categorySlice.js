import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/apiURL";
import { STATUS } from "../utils/status";
import axios from "axios";

const initialState = {
  categories: [],
  categoriesStatus: STATUS.IDLE,
  categoryProducts: [],
  categoryProductsStatus: STATUS.IDLE,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncCategories.pending, (state, action) => {
        state.categoriesStatus = STATUS.LOADING;
      })

      .addCase(fetchAsyncCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.categoriesStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchAsyncCategories.rejected, (state, action) => {
        state.categoriesStatus = STATUS.FAILED;
      })

      .addCase(fetchAsyncProductsOfCategory.pending, (state, action) => {
        state.categoryProductsStatus = STATUS.LOADING;
      })

      .addCase(fetchAsyncProductsOfCategory.fulfilled, (state, action) => {
        state.categoryProducts = action.payload;
        state.categoryProductsStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchAsyncProductsOfCategory.rejected, (state, action) => {
        state.categoryProductsStatus = STATUS.FAILED;
      });
  },
});

// Async thunk for fetching categories
export const fetchAsyncCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    try {
      const response = await axios.get(`${BASE_URL}categories/`);
      const newResponse = response.data.map(obj => obj.name);
      return newResponse;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
);

// Async thunk for fetching products of a specific category
export const fetchAsyncProductsOfCategory = createAsyncThunk(
  "category-products/fetch",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        // `${BASE_URL}products/?category=${encodeURIComponent(category)}`
        `${BASE_URL}productcat/${category}`
      ); // No trailing slash and encode URI component
      console.log("Fetched products of category:", response.data);
      const newResponse = response.data.map(obj => obj.name);
      return response.data;
    } catch (error) {
      console.error("Error fetching category products:", error);
      return rejectWithValue(
        error.response?.data || "Error fetching category products"
      );
    }
  }
);
export const getAllCategories = (state) => state.category.categories;
export const getAllProductsByCategory = (state) =>
  state.category.categoryProducts;
export const getCategoryProductsStatus = (state) =>
  state.category.categoryProductsStatus;
export default categorySlice.reducer;
