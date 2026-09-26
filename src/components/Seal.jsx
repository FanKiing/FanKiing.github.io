
import { useContent } from "../store/hooks.js";

// A wax-seal style mark with the name in Arabic calligraphy.
export default function Seal({ className = "" }) {
  const { profile } = useContent();
  return (
    <svg viewBox="0 0 400 400" role="img" aria-labelledby="sealTitle" className={className}>
      <title id="sealTitle">Seal with the name Yassir in Arabic calligraphy</title>
      <defs>
        <path id="sealRing" d="M200,200 m-152,0 a152,152 0 1,1 304,0 a152,152 0 1,1 -304,0" />
        <radialGradient id="sealFill" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#2b1011" />
          <stop offset="100%" stopColor="#0a0908" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="none" stroke="#c8a86a" strokeOpacity="0.2" />
      <circle cx="200" cy="200" r="178" fill="url(#sealFill)" stroke="#c8a86a" strokeOpacity="0.55" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="126" fill="none" stroke="#c8a86a" strokeOpacity="0.3" />
      <g className="origin-center animate-spin-slow">
        <text fill="#c8a86a" fillOpacity="0.8" fontFamily="Cinzel, Georgia, serif" fontSize="16" fontWeight="700" letterSpacing="7">
          <textPath href="#sealRing">FIRE AND BLOOD ✦ CLEAN CODE ✦ FIRE AND BLOOD ✦ CLEAN CODE ✦</textPath>
        </text>
      </g>
      <text x="200" y="226" textAnchor="middle" fill="#ece6dc" fontFamily="'Aref Ruqaa', 'Amiri', serif" fontSize="96" fontWeight="700">
        {profile.arabicName}
      </text>
    </svg>
  );
}
