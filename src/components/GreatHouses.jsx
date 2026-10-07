import { useDispatch, useSelector } from "react-redux";
import SectionHeader from "./SectionHeader.jsx";
import { HouseBanner, houses } from "./Sigil.jsx";
import { pledged, selectAllegiance } from "../store/allegianceSlice.js";
import { useContent } from "../store/hooks.js";

// The houses as hanging banners. Each banner lists the stack
// groups and principles sworn to it in portfolio.json, and clicking one
// pledges the visitor to that house.
export default function GreatHouses() {
  const { stack, principles } = useContent();
  const dispatch = useDispatch();
  const allegiance = useSelector(selectAllegiance);

  const sworn = (key) => [
    ...stack.filter((g) => g.house === key).map((g) => g.title),
    ...principles.filter((p) => p.house === key).map((p) => p.title),
  ];

  return (
    <section id="houses" className="relative border-t border-bone/[0.06] py-28 md:py-40">
      <div className="wrap">
        <SectionHeader label="The Great Houses" title="Every part of the stack swears to a house">
          Each banner carries a stylised rendering of the house's heraldic arms. Pick one to pledge your
          allegiance, and the whole site takes its colours.
        </SectionHeader>

        <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 lg:grid-cols-5">
          {Object.entries(houses).map(([key, h]) => {
            const vassals = sworn(key);
            const pledgedHere = allegiance === key;
            return (
              <li key={key} data-reveal>
                <button
                  type="button"
                  onClick={() => dispatch(pledged(key))}
                  aria-pressed={pledgedHere}
                  className="group flex w-full cursor-pointer flex-col items-center rounded-xl pt-2 pb-3 text-center transition-colors hover:bg-bone/[0.03]"
                >
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
                  <span
                    className={`mt-3 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      pledgedHere ? "border-transparent text-bone" : "border-bone/10 text-mute group-hover:border-bone/30 group-hover:text-bone"
                    }`}
                    style={pledgedHere ? { background: h.accent } : undefined}
                  >
                    {pledgedHere ? "Sworn ✓" : "Pledge"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
