export interface TestimonialItem {
  quote: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
}

export interface TestimonialsGrid3Props {
  heading?: string;
  subheading?: string;
  items?: TestimonialItem[];
}

const defaultItems: TestimonialItem[] = [
  { quote: "This completely changed how our team ships.", authorName: "Alex Rivera", authorRole: "CTO, Northwind" },
  { quote: "Setup took minutes, not weeks.", authorName: "Priya Menon", authorRole: "Founder, Loopline" },
  { quote: "The best tool we've adopted this year.", authorName: "Sam Okafor", authorRole: "Head of Product, Vela" },
];

export default function TestimonialsGrid3({
  heading = "Loved by teams everywhere",
  subheading,
  items = defaultItems,
}: TestimonialsGrid3Props) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.authorName} className="rounded-lg border border-border bg-surface p-6">
              <blockquote className="text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {t.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatarUrl} alt={t.authorName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                    {t.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold">{t.authorName}</div>
                  {t.authorRole && <div className="text-xs text-foreground/60">{t.authorRole}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
