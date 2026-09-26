import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { wait } from "./http.js";

const STEP = 520; // delay between each bug catching fire
const BURN = 700; // how long a bug burns before turning to ash

// The "php artisan dracarys" terminal. Each bug moves alive -> burning -> ash.
const forgeSlice = createSlice({
  name: "forge",
  initialState: { bugs: [], phase: "idle", elapsed: null },
  reducers: {
    loadBugs(state, action) {
      state.bugs = action.payload.map(() => "alive");
      state.phase = "idle";
      state.elapsed = null;
    },
    started(state) {
      state.phase = "running";
    },
    bugIgnited(state, action) {
      state.bugs[action.payload] = "burning";
    },
    bugBurned(state, action) {
      state.bugs[action.payload] = "ash";
    },
    finished(state, action) {
      state.phase = "done";
      state.elapsed = action.payload;
    },
    reset(state) {
      state.bugs = state.bugs.map(() => "alive");
      state.phase = "idle";
      state.elapsed = null;
    },
  },
});

export const { loadBugs, reset } = forgeSlice.actions;
const { started, bugIgnited, bugBurned, finished } = forgeSlice.actions;

// A thunk that dispatches one action per step, so the UI follows the fire.
export const runDracarys = createAsyncThunk(
  "forge/runDracarys",
  async ({ reducedMotion = false } = {}, { dispatch, getState }) => {
    const step = reducedMotion ? 0 : STEP;
    const burn = reducedMotion ? 0 : BURN;
    const start = performance.now();
    dispatch(started());

    const burns = getState().forge.bugs.map(async (_, i) => {
      await wait(i * step);
      dispatch(bugIgnited(i));
      await wait(burn);
      dispatch(bugBurned(i));
    });
    await Promise.all(burns);

    dispatch(finished(((performance.now() - start) / 1000).toFixed(2)));
  },
  { condition: (_, { getState }) => getState().forge.phase === "idle" }
);

export default forgeSlice.reducer;

export const selectForge = (state) => state.forge;
