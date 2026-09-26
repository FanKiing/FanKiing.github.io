import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FlameField from "./FlameField.jsx";
import Magnetic from "./Magnetic.jsx";
import Button, { Arrow } from "./Button.jsx";
import { copyEmail, selectCopyStatus } from "../store/uiSlice.js";
import { gsap, SplitText, useGSAP, MOTION_OK } from "../lib/gsap.js";
import { useContent } from "../store/hooks.js";

const copyLabels = { idle: "Copy", copied: "Copied", failed: "Selected" };

export default function Contact() {
  const { profile } = useContent();
  const dispatch = useDispatch();
  const copyStatus = useSelector(selectCopyStatus);
  const root = useRef(null);
  const emailRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let split;
        document.fonts.ready.then(() => {
          if (!root.current) return;
          split = SplitText.create(".contact-title", { type: "lines", mask: "lines" });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ".contact-title", start: "top 85%", once: true },
          });
        });
        return () => split?.revert();
      });
    },
    { scope: root }
  );

  // When the clipboard is blocked, select the address so it can be copied by hand.
  useEffect(() => {
    if (copyStatus !== "failed" || !emailRef.current) return;
    const range = document.createRange();
    range.selectNodeContents(emailRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, [copyStatus]);

  const links = [
    { label: "LinkedIn", href: profile.linkedin },
    { label: "GitHub", href: profile.github },
  ];

  return (
    <section id="contact" ref={root} className="relative isolate overflow-hidden border-t border-bone/[0.06] py-32 md:py-44">
      <FlameField intensity={0.75} className="opacity-80" />
      <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-ink to-transparent" aria-hidden="true" />

      <div className="wrap">
        <p data-reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-crimson">
          <span className="size-1.5 rotate-45 bg-crimson" />
          Send a raven
        </p>
        <h2 className="contact-title mt-6 max-w-4xl text-[clamp(2.8rem,8vw,7rem)] font-semibold leading-[0.98] tracking-tighter">
          Have something worth building?
        </h2>
        <p data-reveal className="mt-8 max-w-lg text-lg leading-relaxed text-bone/75">
          A role, a freelance project or a stubborn bug. Write to me and tell me what you have in mind.
        </p>

        <div data-reveal className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <Button href={`mailto:${profile.email}`} className="px-7 py-4 text-base">
              <span ref={emailRef} className="select-all">{profile.email}</span>
              <Arrow />
            </Button>
          </Magnetic>
          <Button variant="ghost" onClick={() => dispatch(copyEmail(profile.email))} aria-live="polite" className="py-4">
            {copyLabels[copyStatus]}
          </Button>
        </div>

        <ul data-reveal className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-bone/[0.08] pt-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-lg text-bone/80 transition-colors hover:text-bone"
              >
                {link.label}
                <span className="text-crimson transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
