import Link from "next/link";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthPageShell({
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_12%,transparent_88%),transparent_28%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--secondary)_10%,transparent_90%),transparent_30%)]" />
      <div className="page-shell relative flex min-h-screen items-center justify-center py-10">
        <section className="mx-auto w-full max-w-xl">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Link href="/posts" className="font-heading text-lg font-semibold tracking-tight">
              Creator Lab
            </Link>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              V1
            </span>
          </div>

          <div className="mb-6 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Every post makes the next one better
            </p>
          </div>

          <div className="rounded-[28px] border border-border/80 bg-card/88 p-5 shadow-[0_24px_80px_-32px_color-mix(in_srgb,var(--foreground)_25%,transparent)] backdrop-blur-sm md:p-7">
            <div className="mb-6 space-y-3 text-center">
              <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.1rem]">
                {title}
              </h1>
              <p className="mx-auto max-w-lg text-sm leading-6 text-muted-foreground md:text-base">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
