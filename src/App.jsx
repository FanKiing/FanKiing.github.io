import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Lenis from "lenis";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Stack from "./components/Stack.jsx";
import Principles from "./components/Principles.jsx";
import GreatHouses from "./components/GreatHouses.jsx";
import Forge from "./components/Forge.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Allegiance from "./components/Allegiance.jsx";
import DracarysEgg from "./components/DracarysEgg.jsx";
import Loader from "./components/Loader.jsx";
import { fetchPortfolio, selectContentError, selectContentStatus } from "./store/contentSlice.js";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, prefersReducedMotion } from "./lib/gsap.js";

// Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync.
function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;
    const lenis = new Lenis({ anchors: { offset: -64 }, lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [enabled]);
}

function Page() {
  // Every element marked data-reveal rises into place the first time it scrolls into view.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Stack />
        <Principles />
        <GreatHouses />
        <Forge />
        <Contact />
      </main>
      <Footer />
      <Allegiance />
      <DracarysEgg />
    </>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const status = useSelector(selectContentStatus);
  const error = useSelector(selectContentError);
  const ready = status === "succeeded";

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  useSmoothScroll(ready);

  if (!ready) {
    return <Loader error={status === "failed" ? error : null} onRetry={() => dispatch(fetchPortfolio())} />;
  }
  return <Page />;
}
