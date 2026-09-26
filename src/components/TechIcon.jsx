import { techIcons } from "../lib/techIcons.js";

// Tools without a Simple Icons mark get a lettered badge in their brand colour.
const monograms = {
  Reverb: { hex: "#FF2D20", letter: "R" },
  Telescope: { hex: "#4040C8", letter: "T" },
  Blade: { hex: "#F05340", letter: "B" },
  SweetAlert: { hex: "#E16C8E", letter: "S" },
  "VS Code": { hex: "#2F80ED", letter: "</>" },
  Word: { hex: "#2B7CD3", letter: "W" },
  Excel: { hex: "#21A366", letter: "X" },
  PowerPoint: { hex: "#D35230", letter: "P" },
};

// Brand colours this dark would vanish on the ink background, so they fall back to bone.
function readable(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 60 ? hex : "var(--color-bone)";
}

export default function TechIcon({ name, className = "size-4" }) {
  const icon = techIcons[name];
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill={readable(icon.hex)} aria-hidden="true">
        <path d={icon.path} />
      </svg>
    );
  }
  const mono = monograms[name] ?? { hex: "#8f8780", letter: name.charAt(0) };
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="5" fill={mono.hex} />
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontFamily="Geist, system-ui, sans-serif"
        fontSize={mono.letter.length > 1 ? 9 : 14}
        fontWeight="700"
      >
        {mono.letter}
      </text>
    </svg>
  );
}
