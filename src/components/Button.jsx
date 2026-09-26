// Shared link-button. "primary" is crimson; "ghost" is a hairline outline.
const styles = {
  primary:
    "bg-crimson text-bone hover:bg-ember hover:text-ink shadow-[0_0_0_0_rgb(240_106_44/0)] hover:shadow-[0_10px_40px_-8px_rgb(240_106_44/0.6)]",
  ghost: "border border-bone/15 text-bone hover:border-bone/40 hover:bg-bone/5",
};

export default function Button({ href, variant = "primary", children, className = "", ...rest }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      type={href ? undefined : "button"}
      className={`group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-medium transition-[background-color,color,box-shadow,border-color] duration-300 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Arrow({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-4 transition-transform duration-300 group-hover:translate-x-0.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
