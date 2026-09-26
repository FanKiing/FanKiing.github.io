import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGithubProfile, selectGithub } from "../store/githubSlice.js";

function Stat({ label, value, loading }) {
  return (
    <div>
      <dt className="text-xs text-mute">{label}</dt>
      <dd className="mt-1 font-mono text-2xl tabular-nums text-bone">
        {loading ? <span className="inline-block h-7 w-12 animate-pulse rounded bg-bone/10" /> : value}
      </dd>
    </div>
  );
}

// Live numbers fetched from the GitHub REST API through a Redux thunk.
export default function GithubCard({ username, className = "" }) {
  const dispatch = useDispatch();
  const { status, profile, error } = useSelector(selectGithub);
  const loading = status === "idle" || status === "loading";

  useEffect(() => {
    dispatch(fetchGithubProfile(username));
  }, [dispatch, username]);

  return (
    <article className={`spotlight flex flex-col rounded-2xl border border-bone/[0.08] bg-ink-2/80 p-6 ${className}`}>
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
        <span className={`size-1.5 rounded-full ${status === "failed" ? "bg-mute" : "bg-ember"} ${loading ? "animate-pulse" : ""}`} />
        Live from GitHub
      </p>

      {status === "failed" ? (
        <div className="mt-5 flex flex-1 flex-col justify-between gap-4">
          <p className="text-sm leading-relaxed text-mute" role="status">
            GitHub stats could not load. <span className="sr-only">{error}</span>
          </p>
          <button
            type="button"
            onClick={() => dispatch(fetchGithubProfile(username))}
            className="self-start rounded-full border border-bone/15 px-4 py-2 text-sm transition-colors hover:border-bone/40"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="mt-5 flex items-center gap-3">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" width="40" height="40" className="size-10 rounded-full ring-1 ring-bone/15" />
            ) : (
              <span className="size-10 animate-pulse rounded-full bg-bone/10" />
            )}
            <a href={profile?.url ?? `https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-ember">
              @{username}
            </a>
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-3" aria-busy={loading}>
            <Stat label="Repos" value={profile?.publicRepos} loading={loading} />
            <Stat label="Followers" value={profile?.followers} loading={loading} />
            <Stat label="Since" value={profile?.memberSince} loading={loading} />
          </dl>
        </>
      )}
    </article>
  );
}
