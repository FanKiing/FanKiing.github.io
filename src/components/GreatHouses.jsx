import SectionHeader from "./SectionHeader.jsx";
import { HouseBanner, houses } from "./Sigil.jsx";
import { useContent } from "../store/hooks.js";

// The eight great houses as hanging banners. Each banner lists the stack
// groups and principles sworn to it in portfolio.json.
export default function GreatHouses() {
  const { stack, principles } = useContent();

  const sworn = (key) => [
    ...stack.filter((g) => g.house === key).map((g) => g.title),
    ...principles.filter((p) => p.house === key).map((p) => p.title),
  ];

  return (
    <section id="houses" className="relative border-t border-bone/[0.06] py-28 md:py-40">
      <div className="wrap">
        <SectionHeader label="The Great Houses" title="Every part of the stack swears to a house">
          Each banner carries the house's arms as the books blazon them. Hover one to see who holds its
          seat in this portfolio.
        </SectionHeader>

        <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 lg:grid-cols-8">
          {Object.entries(houses).map(([key, h]) => {
            const vassals = sworn(key);
            return (
              <li key={key} data-reveal>
                <div tabIndex={0} className="group flex flex-col items-center text-center outline-none">
                  <HouseBanner
                    house={key}
                    title={`Banner of ${h.name}: ${h.blazon}`}
                    className="banner-sway w-24 drop-shadow-[0_18px_28px_rgb(0_0_0/0.55)] transition-transform duration-500 group-hover:-translate-y-1 lg:w-full lg:max-w-28"
                  />
                  <h3 className="mt-5 font-display text-sm font-bold tracking-[0.08em]" style={{ color: h.color }}>
                    {h.name.replace("House ", "")}
                  </h3>
                  <p className="mt-1 text-xs italic leading-snug text-bone/60">“{h.words}”</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{h.seat}</p>
                  <p className="mt-3 min-h-8 text-xs leading-snug text-mute opacity-70 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {vassals.length ? vassals.join(" · ") : "Holds no seat yet"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
