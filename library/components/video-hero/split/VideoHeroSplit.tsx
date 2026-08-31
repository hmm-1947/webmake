export interface VideoHeroSplitProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  videoUrl?: string;
  posterUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function VideoHeroSplit({
  eyebrow = "Product demo",
  heading = "See it in action",
  subheading = "A quick look at how it fits into your everyday workflow.",
  videoUrl = "",
  posterUrl = "",
  ctaLabel = "Watch full demo",
  ctaHref = "#demo",
}: VideoHeroSplitProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">{eyebrow}</p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">{heading}</h1>
          <p className="mt-6 text-lg leading-8 text-foreground/65">{subheading}</p>
          <a
            href={ctaHref}
            className="mt-8 inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            {ctaLabel}
          </a>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-950 shadow-xl">
          {videoUrl ? (
            <video className="h-full w-full object-cover" controls poster={posterUrl || undefined}>
              <source src={videoUrl} />
            </video>
          ) : posterUrl ? (
            <img src={posterUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,hsl(var(--accent)/.4),transparent_45%),linear-gradient(135deg,#0b1220,#1c2b45)]">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur">▶</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
