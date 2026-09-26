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
    </footer>
  );
}
