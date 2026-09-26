import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { wait } from "./http.js";

const uiSlice = createSlice({
  name: "ui",
  initialState: { copyStatus: "idle" }, // idle | copied | failed
  reducers: {
    copyStatusChanged(state, action) {
      state.copyStatus = action.payload;
    },
  },
});

const { copyStatusChanged } = uiSlice.actions;

// Copies the email address. When the clipboard is unavailable the component
// falls back to selecting the text, so the visitor can copy it by hand.
export const copyEmail = createAsyncThunk("ui/copyEmail", async (email, { dispatch }) => {
  try {
    await navigator.clipboard.writeText(email);
    dispatch(copyStatusChanged("copied"));
  } catch {
    dispatch(copyStatusChanged("failed"));
  }
  await wait(1800);
  dispatch(copyStatusChanged("idle"));
});

export default uiSlice.reducer;

export const selectCopyStatus = (state) => state.ui.copyStatus;
