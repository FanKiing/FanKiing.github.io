import { useRef } from "react";
import FlameField from "./FlameField.jsx";
import Seal from "./Seal.jsx";
import Marquee from "./Marquee.jsx";
import Magnetic from "./Magnetic.jsx";
import Button, { Arrow } from "./Button.jsx";
import { gsap, SplitText, useGSAP, MOTION_OK, MOTION_REDUCED } from "../lib/gsap.js";
import { useContent } from "../store/hooks.js";

export default function Hero() {
  const { profile } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-fade", { y: 28, autoAlpha: 0, duration: 1.2, stagger: 0.08 }, 0.5)
          .from(".hero-seal", { scale: 0.85, rotate: -25, autoAlpha: 0, duration: 1.8 }, 0.3)
          .from(".hero-marquee", { autoAlpha: 0, duration: 1.4 }, 0.9);

        // Split the name only once its webfont is ready, so letters are measured correctly.
        let split;
        document.fonts.ready.then(() => {
          if (!root.current) return;
          split = SplitText.create(".hero-name", { type: "chars", mask: "chars" });
          gsap.set(".hero-name", { autoAlpha: 1 });
          gsap.from(split.chars, { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.05 });
        });

        // Content drifts up and fades as the hero scrolls away.
        gsap.to(".hero-inner", {
          yPercent: -18,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => split?.revert();
      });

      mm.add(MOTION_REDUCED, () => {
        gsap.set(".hero-name", { autoAlpha: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <FlameField />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-ink" aria-hidden="true" />

      <div className="hero-inner wrap grid flex-1 items-end gap-12 pb-14 pt-32 lg:grid-cols-[minmax(0,1fr)_auto] lg:pb-20">
        <div>
          <p className="hero-fade flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-bone/70">
            <span className="size-1.5 rotate-45 bg-crimson" />
            {profile.role}
          </p>

          <h1 className="hero-name invisible mt-6 font-display text-[clamp(4.25rem,17vw,12.5rem)] font-bold leading-[0.9] tracking-[-0.01em]">
            {profile.name}
          </h1>

          <p className="hero-fade mt-8 max-w-xl text-lg leading-relaxed text-bone/80 md:text-xl">
            I build Laravel back ends and React front ends that feel fast, read clearly and stay
            easy to maintain.
          </p>
          <p className="hero-fade mt-3 text-sm text-mute">
            It's <em className="not-italic text-bone">Yassir</em>, with a double s. Not Yasir, not Yasser.
          </p>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button href="#contact">
                Get in touch <Arrow />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="#forge" variant="ghost" className="bg-ink/50 backdrop-blur-md">
                Run <span className="font-mono text-ember">dracarys</span>
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className="hero-seal hidden lg:block">
          <Seal className="size-56 opacity-90 xl:size-64" />
        </div>
      </div>

      <div className="hero-marquee">
        <Marquee />
      </div>
    </section>
  );
}
