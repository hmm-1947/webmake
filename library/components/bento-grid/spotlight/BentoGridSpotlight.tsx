import Image from "next/image";

export interface BentoGridSpotlightItem { title: string; description?: string; imageUrl?: string; imageAlt?: string; size?: "large" | "small" }
export interface BentoGridSpotlightProps { heading?: string; subheading?: string; items?: BentoGridSpotlightItem[] }

const defaults: BentoGridSpotlightItem[] = [
  { title: "A complete view", description: "Bring the important story into focus.", imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80", imageAlt: "Creative workspace", size: "large" },
  { title: "Built for clarity", description: "Simple surfaces for complex ideas.", imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80", imageAlt: "Design interface", size: "small" },
  { title: "Made to stand out", description: "Distinctive presentation without unnecessary noise.", imageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80", imageAlt: "Abstract gradient", size: "small" },
];

export default function BentoGridSpotlight({ heading = "Designed around your story", subheading, items = defaults }: BentoGridSpotlightProps) {
  return <section className="py-20 md:py-28"><div className="container">
    <div className="max-w-2xl"><h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>{subheading && <p className="mt-4 text-lg text-foreground/65">{subheading}</p>}</div>
    <div className="mt-12 grid gap-4 md:grid-cols-2">
      {items.map((item, i) => <article key={item.title} className={`group relative overflow-hidden rounded-2xl border border-border bg-surface ${item.size === "large" || (i === 0) ? "md:row-span-2 md:min-h-[520px]" : "min-h-[250px]"}`}>
        {item.imageUrl && <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-white"><h3 className="font-heading text-2xl font-semibold">{item.title}</h3>{item.description && <p className="mt-2 max-w-lg text-sm text-white/75">{item.description}</p>}</div>
      </article>)}
    </div>
  </div></section>;
}
