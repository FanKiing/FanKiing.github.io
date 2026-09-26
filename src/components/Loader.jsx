// Shown while the content JSON loads, and with a retry button if it fails.
export default function Loader({ error, onRetry }) {
  return (
    <div className="grid min-h-svh place-items-center px-5 text-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-6">
        <span lang="ar" className={`font-arabic text-6xl text-crimson ${error ? "" : "animate-pulse"}`}>ياسر</span>
        {error ? (
          <>
            <p className="max-w-sm text-mute">The page content could not load. Check your connection and try again.</p>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full border border-bone/15 px-5 py-2.5 text-sm transition-colors hover:border-crimson hover:bg-crimson"
            >
              Try again
            </button>
          </>
        ) : (
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-mute">Lighting the forge</p>
        )}
      </div>
    </div>
  );
}
