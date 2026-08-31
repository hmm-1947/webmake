export interface TimelineYear { year: string; title: string; description: string }
export interface TimelineHorizontalProps { eyebrow?: string; heading?: string; items?: TimelineYear[] }

const defaults: TimelineYear[] = [
  { year: "2019", title: "Founded", description: "Started with a small team and a clear idea." },
  { year: "2021", title: "First 1,000 customers", description: "Grew through word of mouth and referrals." },
  { year: "2023", title: "Series A", description: "Raised funding to expand the team and product." },
  { year: "2026", title: "Global reach", description: "Now serving customers across 30+ countries." },
];

export default function TimelineHorizontal({ eyebrow = "Our journey", heading = "Milestones along the way", items = defaults }: TimelineHorizontalProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        </div>
        <div className="mt-14 overflow-x-auto pb-4">
          <div className="relative flex min-w-max gap-8 px-2">
            <div className="absolute left-0 right-0 top-6 h-px bg-border" aria-hidden="true" />
            {items.map((item) => (
              <div key={item.year} className="relative w-64 shrink-0">
                <div className="relative flex h-12 items-center">
                  <span className="relative z-10 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                </div>
                <p className="font-mono text-sm font-semibold text-accent">{item.year}</p>
                <h3 className="mt-1 font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/65">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
