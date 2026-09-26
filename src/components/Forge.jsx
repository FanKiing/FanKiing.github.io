import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionHeader from "./SectionHeader.jsx";
import Button from "./Button.jsx";
import { loadBugs, reset, runDracarys, selectForge } from "../store/forgeSlice.js";
import { useContent } from "../store/hooks.js";
import { prefersReducedMotion } from "../lib/gsap.js";

const PROMPT = "yassir:~/kingdom$";

const bugStyle = {
  alive: "text-[#e7a6a0]",
  burning: "text-ember [text-shadow:0_0_10px_var(--color-ember),0_0_24px_var(--color-crimson)]",
  ash: "text-bone/20 line-through",
};

export default function Forge() {
  const { bugs } = useContent();
  const dispatch = useDispatch();
  const { bugs: states, phase, elapsed } = useSelector(selectForge);

  useEffect(() => {
    dispatch(loadBugs(bugs));
  }, [dispatch, bugs]);

  const idleLine = (
    <>
      <span className="text-gold">{PROMPT}</span> <span className="animate-pulse text-mute">▍</span>
    </>
  );

  return (
    <section id="forge" className="relative border-t border-bone/[0.06] py-28 md:py-40">
      <div className="wrap">
        <SectionHeader label="Dracarys" title="One command for every project">
          Four bugs are waiting at the gates. Run the command and watch them burn.
        </SectionHeader>

        <div data-reveal className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-bone/[0.08] bg-[#080607] shadow-[0_40px_120px_-40px_rgb(180_35_42/0.45)]">
          <div className="flex items-center gap-2 border-b border-bone/[0.06] px-5 py-3.5">
            <span className="size-2.5 rounded-full bg-crimson" />
            <span className="size-2.5 rounded-full bg-bone/10" />
            <span className="size-2.5 rounded-full bg-bone/10" />
            <span className="ml-3 font-mono text-xs text-mute">~/kingdom — zsh</span>
          </div>
          <pre className="whitespace-pre-wrap break-words px-5 py-6 font-mono text-[13px] leading-[1.9] md:px-7 md:text-sm" aria-live="polite">
            <span className="text-gold">{PROMPT}</span> php artisan bugs:list{"\n"}
            <span className="text-mute">Found {bugs.length} enemies at the gates:</span>{"\n"}
            {bugs.map((bug, i) => (
              <span key={bug} className={`block transition-[color,text-shadow] duration-500 ${bugStyle[states[i] ?? "alive"]}`}>
                {"  ✗ "}{bug}
              </span>
            ))}
            {phase === "idle" ? (
              idleLine
            ) : (
              <>
                <span className="text-gold">{PROMPT}</span> php artisan dracarys{"\n"}
                {phase === "done" && (
                  <>
                    <span className="text-gold">  ✓ {bugs.length} bugs reduced to ash in {elapsed}s</span>{"\n"}
                    <span className="text-gold">  ✓ Tests green. The realm is at peace.</span>{"\n"}
                    {idleLine}
                  </>
                )}
              </>
            )}
          </pre>
        </div>

        <div className="mt-8 flex justify-center">
          {phase === "done" ? (
            <Button variant="ghost" onClick={() => dispatch(reset())}>Summon them again</Button>
          ) : (
            <Button
              onClick={() => dispatch(runDracarys({ reducedMotion: prefersReducedMotion() }))}
              disabled={phase === "running"}
              className="font-mono disabled:opacity-60"
            >
              php artisan dracarys
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
