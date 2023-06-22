import { createSlice } from "@reduxjs/toolkit";

const citySlice = createSlice({
  name: "cities",
  initialState: {
    page: 1, // for monitoring the registration process.
    cities: [],
  },
  reducers: {
    addCities: (state, { payload }) => {},
  },
  extraReducers: {},
});

export const { addCities } = citySlice.actions;

export default citySlice.reducer;

export const selectCurrentPage = (state) => state.cities.page;
export const selectCurrentCities = (state) => state.cities.cities;
