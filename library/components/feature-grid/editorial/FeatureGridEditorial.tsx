import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeatureGridItem { icon?: string; title: string; description: string; tag?: string }
export interface FeatureGridEditorialProps { eyebrow?: string; heading?: string; subheading?: string; items?: FeatureGridItem[] }

const defaults: FeatureGridItem[] = [
  { icon: "Sparkles", title: "Thoughtful by default", description: "A focused experience with the details already taken care of.", tag: "01" },
  { icon: "Layers3", title: "Made to compose", description: "Flexible building blocks that adapt as your needs evolve.", tag: "02" },
  { icon: "ShieldCheck", title: "Ready for production", description: "Reliable foundations, sensible defaults, and room to scale.", tag: "03" },
  { icon: "Gauge", title: "Fast and focused", description: "Less friction between an idea and something your customers can use.", tag: "04" },
];

function icon(name?: string): LucideIcon { return (name && (Icons as unknown as Record<string, LucideIcon>)[name]) || Icons.Sparkles; }

export default function FeatureGridEditorial({ eyebrow = "Capabilities", heading = "Everything works together", subheading, items = defaults }: FeatureGridEditorialProps) {
  return <section className="py-20 md:py-28">
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">{eyebrow}</p><h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>{subheading && <p className="mt-4 text-lg text-foreground/65">{subheading}</p>}</div>
        <div className="grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {items.map((item, i) => { const Icon = icon(item.icon); return <article key={item.title} className="group p-7 transition hover:bg-surface sm:border-b sm:border-border [&:nth-last-child(-n+2)]:border-b-0">
            <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-accent"/><span className="font-mono text-xs text-foreground/35">{item.tag || String(i + 1).padStart(2, "0")}</span></div>
            <h3 className="mt-10 font-heading text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-foreground/65">{item.description}</p>
          </article> })}
        </div>
      </div>
    </div>
  </section>;
}
