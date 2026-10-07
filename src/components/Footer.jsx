import { useContent } from "../store/hooks.js";

export default function Footer() {
  const { profile } = useContent();
  return (
    <footer className="border-t border-bone/[0.06] py-10">
      <div className="wrap flex flex-col items-center gap-4 text-sm text-mute md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} {profile.fullName}</p>
        <p lang="ar" className="font-arabic text-3xl leading-none text-crimson">{profile.arabicName}</p>
        <p className="italic">Winter is coming. The deploy is already live.</p>
      </div>
      <p className="wrap mt-6 text-center text-xs text-mute/70 md:text-left">
        House sigils: original artwork and adaptations from{" "}
        <a href="https://game-icons.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-bone">
          game-icons.net
        </a>{" "}
        (CC BY 3.0). Tech logos from{" "}
        <a href="https://simpleicons.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-bone">
          Simple Icons
        </a>
        .
      </p>
    </footer>
  );
}
