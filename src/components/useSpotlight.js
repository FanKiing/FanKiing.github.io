import { useEffect } from "react";

// Feeds the pointer position into --mx / --my on every .spotlight card inside `ref`.
export default function useSpotlight(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onMove = (e) => {
      const card = e.target.closest?.(".spotlight");
      if (!card || !root.contains(card)) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, [ref]);
}
