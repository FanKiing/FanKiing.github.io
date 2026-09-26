import { useId } from "react";
import { sigilLayers } from "../lib/sigilPaths.js";
import { useContent } from "../store/hooks.js";

// Optional artwork per house from portfolio.json, e.g.
// "sigilImages": { "stark": "sigils/stark.png" } with the file in public/sigils/.
// Houses without an entry keep the drawn charge.
function useSigilImage(house) {
  const path = useContent()?.sigilImages?.[house];
  return path ? `${import.meta.env.BASE_URL}${path}` : null;
}

// The great houses of Westeros. `field` and `charge` follow each house's blazon
// in the books (e.g. Stark: a grey direwolf on an ice-white field); `color` is
// a tint of the house that reads on the ink background.
export const houses = {
  targaryen: {
    name: "House Targaryen",
    words: "Fire and Blood",
    seat: "Dragonstone",
    blazon: "A red three-headed dragon on black",
    color: "#b4232a",
    field: "#0e0c0c",
    charge: "#b4232a",
  },
  stark: {
    name: "House Stark",
    words: "Winter Is Coming",
    seat: "Winterfell",
    blazon: "A grey direwolf on an ice-white field",
    color: "#a9b8c6",
    field: "#e6eaee",
    charge: "#5f6b76",
  },
  lannister: {
    name: "House Lannister",
    words: "Hear Me Roar!",
    seat: "Casterly Rock",
    blazon: "A golden lion rampant on crimson",
    color: "#c8a86a",
    field: "#8a1c1f",
    charge: "#e0b44a",
  },
  baratheon: {
    name: "House Baratheon",
    words: "Ours Is the Fury",
    seat: "Storm's End",
    blazon: "A crowned black stag on gold",
    color: "#e3b23c",
    field: "#e3b23c",
    charge: "#141111",
  },
  tyrell: {
    name: "House Tyrell",
    words: "Growing Strong",
    seat: "Highgarden",
    blazon: "A golden rose on a grass-green field",
    color: "#8fb573",
    field: "#3d6a34",
    charge: "#e8c75a",
  },
  greyjoy: {
    name: "House Greyjoy",
    words: "We Do Not Sow",
    seat: "Pyke",
    blazon: "A golden kraken on black",
    color: "#d4b54a",
    field: "#101214",
    charge: "#d4b54a",
  },
  martell: {
    name: "House Martell",
    words: "Unbowed, Unbent, Unbroken",
    seat: "Sunspear",
    blazon: "A red sun pierced by a golden spear, on orange",
    color: "#f06a2c",
    field: "#e27a2e",
    charge: "#a3201c",
  },
  arryn: {
    name: "House Arryn",
    words: "As High as Honor",
    seat: "The Eyrie",
    blazon: "A white moon-and-falcon on sky blue",
    color: "#7fa7d9",
    field: "#5f8fcb",
    charge: "#f4f2ec",
  },
};

// The charge's layers. `outline` strokes each one in the field colour, so
// overlapping pieces (the stag's crown over its antlers) stay distinct.
function Charge({ house, fill, outline }) {
  return (
    <g fill={fill}>
      {sigilLayers[house].map((l, i) => (
        <path
          key={i}
          d={l.d}
          transform={l.transform}
          {...(outline && { stroke: outline, strokeWidth: 36, paintOrder: "stroke" })}
        />
      ))}
    </g>
  );
}

const a11yProps = (title) => (title ? { role: "img", "aria-label": title } : { "aria-hidden": true });

// The bare charge in one colour. Decorative unless a `title` is given, since
// the house name is usually printed next to it.
export default function Sigil({ house, className = "size-10", title }) {
  if (!sigilLayers[house]) return null;
  return (
    <svg viewBox="0 0 512 512" className={`shrink-0 ${className}`} {...a11yProps(title)}>
      <Charge house={house} fill="currentColor" />
    </svg>
  );
}

// Heater shield: the house charge in its tincture on its field, rimmed in gold.
const SHIELD = "M6 6H94V52C94 84 66 104 50 114C34 104 6 84 6 52Z";

export function HouseShield({ house, className = "size-10", title }) {
  const id = useId();
  const image = useSigilImage(house);
  const h = houses[house];
  if (!h) return null;
  if (image) {
    return (
      <img
        src={image}
        alt={title ?? ""}
        aria-hidden={title ? undefined : true}
        loading="lazy"
        className={`shrink-0 object-contain ${className}`}
      />
    );
  }
  return (
    <svg viewBox="0 0 100 120" className={`shrink-0 ${className}`} {...a11yProps(title)}>
      <defs>
        <clipPath id={`${id}c`}>
          <path d={SHIELD} />
        </clipPath>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d={SHIELD} fill={h.field} />
      <g clipPath={`url(#${id}c)`}>
        <svg x="14" y="14" width="72" height="72" viewBox="0 0 512 512">
          <Charge house={house} fill={h.charge} outline={h.field} />
        </svg>
        <path d={SHIELD} fill={`url(#${id}g)`} />
      </g>
      <path d={SHIELD} fill="none" stroke="#c8a86a" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

// A swallowtail banner hanging from a gilded pole, as flown over a castle gate.
const BANNER = "M10 8H90V132L50 114L10 132Z";

export function HouseBanner({ house, className = "", title }) {
  const id = useId();
  const image = useSigilImage(house);
  const h = houses[house];
  if (!h) return null;
  return (
    <svg viewBox="0 0 100 140" className={`shrink-0 overflow-visible ${className}`} {...a11yProps(title)}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d={BANNER} fill={h.field} />
      {image ? (
        <image href={image} x="14" y="22" width="72" height="80" preserveAspectRatio="xMidYMid meet" />
      ) : (
        <svg x="18" y="30" width="64" height="64" viewBox="0 0 512 512">
          <Charge house={house} fill={h.charge} outline={h.field} />
        </svg>
      )}
      <path d={BANNER} fill={`url(#${id}g)`} />
      <path d={BANNER} fill="none" stroke="#c8a86a" strokeOpacity="0.7" strokeWidth="1.5" />
      <rect x="2" y="3" width="96" height="6" rx="3" fill="#c8a86a" />
      <circle cx="3" cy="6" r="4" fill="#c8a86a" />
      <circle cx="97" cy="6" r="4" fill="#c8a86a" />
    </svg>
  );
}
