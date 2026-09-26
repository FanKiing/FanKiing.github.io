import { createSlice } from "@reduxjs/toolkit";

// The house a visitor has pledged to. It recolours the site's accent and is
// remembered in localStorage, which may be unavailable (private mode, blocked storage).
const KEY = "allegiance";

function load() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function persistAllegiance(house) {
  try {
    if (house) localStorage.setItem(KEY, house);
    else localStorage.removeItem(KEY);
  } catch {
    // Storage is optional; the pledge still holds for this visit.
  }
}

const allegianceSlice = createSlice({
  name: "allegiance",
  initialState: { house: load() },
  reducers: {
    pledged(state, action) {
      state.house = state.house === action.payload ? null : action.payload;
    },
  },
});

export const { pledged } = allegianceSlice.actions;
export default allegianceSlice.reducer;

export const selectAllegiance = (state) => state.allegiance.house;
