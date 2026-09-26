import { configureStore } from "@reduxjs/toolkit";
import content from "./contentSlice.js";
import github from "./githubSlice.js";
import forge from "./forgeSlice.js";
import ui from "./uiSlice.js";
import allegiance from "./allegianceSlice.js";

export const store = configureStore({
  reducer: { content, github, forge, ui, allegiance },
});
