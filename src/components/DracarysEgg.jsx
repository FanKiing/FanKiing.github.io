import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/gsap.js";

const WORD = "dracarys";
const DURATION = 2600;

// Type "dracarys" anywhere outside a form field and the page goes up in flames.
export default function DracarysEgg() {
  const [burning, setBurning] = useState(false);

  useEffect(() => {
    let typed = "";
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, [contenteditable='true']")) return;
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-WORD.length);
      if (typed === WORD) {
        typed = "";
        setBurning(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!burning) return;
    const id = setTimeout(() => setBurning(false), DURATION);
    return () => clearTimeout(id);
  }, [burning]);

  if (!burning) return null;
  const motion = !prefersReducedMotion();
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" role="status" aria-live="polite">
      {motion && <div className="dracarys-fire absolute inset-x-0 bottom-0 h-[120%]" aria-hidden="true" />}
      <p className="dracarys-word absolute inset-0 grid place-items-center font-display text-[clamp(3rem,12vw,9rem)] font-bold tracking-[0.12em] text-bone">
        DRACARYS
      </p>
    </div>
  );
}
