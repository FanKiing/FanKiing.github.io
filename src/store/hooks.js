import { useSelector } from "react-redux";
import { selectContent } from "./contentSlice.js";

// Content is guaranteed to be loaded once the page sections render (see App).
export const useContent = () => useSelector(selectContent);
