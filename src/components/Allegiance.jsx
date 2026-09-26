import { useEffect } from "react";
import { useSelector } from "react-redux";
import Snowfall from "./Snowfall.jsx";
import { houses } from "./Sigil.jsx";
import { persistAllegiance, selectAllegiance } from "../store/allegianceSlice.js";

// Applies the pledged house: its accent replaces crimson site-wide, and the
// North brings its weather with it.
export default function Allegiance() {
  const house = useSelector(selectAllegiance);
  const valid = houses[house] ? house : null;

  useEffect(() => {
    persistAllegiance(valid);
    const root = document.documentElement;
    if (valid) {
      root.style.setProperty("--color-crimson", houses[valid].accent);
      root.dataset.house = valid;
    } else {
      root.style.removeProperty("--color-crimson");
      delete root.dataset.house;
    }
  }, [valid]);

  return valid === "stark" ? <Snowfall /> : null;
}
