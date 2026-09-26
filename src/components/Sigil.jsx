import { sigilPaths } from "../lib/sigilPaths.js";

// The great houses of Westeros: sigil, name, words and a tint that reads on ink.
export const houses = {
  targaryen: { name: "House Targaryen", words: "Fire and Blood", color: "#b4232a" },
  lannister: { name: "House Lannister", words: "Hear Me Roar!", color: "#c8a86a" },
  stark: { name: "House Stark", words: "Winter Is Coming", color: "#a9b8c6" },
  tyrell: { name: "House Tyrell", words: "Growing Strong", color: "#8fb573" },
  greyjoy: { name: "House Greyjoy", words: "We Do Not Sow", color: "#d4b54a" },
  baratheon: { name: "House Baratheon", words: "Ours Is the Fury", color: "#e3b23c" },
  martell: { name: "House Martell", words: "Unbowed, Unbent, Unbroken", color: "#f06a2c" },
  arryn: { name: "House Arryn", words: "As High as Honor", color: "#7fa7d9" },
};

// Decorative unless a `title` is given, since the house name is usually printed next to it.
export default function Sigil({ house, className = "size-10", title }) {
  const path = sigilPaths[house];
  if (!path) return null;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };
  return (
    <svg viewBox="0 0 512 512" className={`shrink-0 ${className}`} fill="currentColor" {...a11y}>
      <path d={path} />
    </svg>
  );
}
