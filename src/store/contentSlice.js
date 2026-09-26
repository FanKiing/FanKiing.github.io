import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJSON } from "./http.js";

// The site content lives in public/data/portfolio.json and is loaded with fetch.
// BASE_URL keeps the path right on GitHub Pages sub-paths.
export const fetchPortfolio = createAsyncThunk(
  "content/fetchPortfolio",
  (_, { signal }) => getJSON(`${import.meta.env.BASE_URL}data/portfolio.json`, { signal }),
  {
    // Skip duplicate requests, e.g. from React StrictMode's double effect.
    condition: (_, { getState }) => {
      const { status } = getState().content;
      return status !== "loading" && status !== "succeeded";
    },
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState: { status: "idle", data: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load the portfolio content.";
      });
  },
});

export default contentSlice.reducer;

export const selectContentStatus = (state) => state.content.status;
export const selectContentError = (state) => state.content.error;
export const selectContent = (state) => state.content.data;
export const selectProfile = (state) => state.content.data?.profile;
