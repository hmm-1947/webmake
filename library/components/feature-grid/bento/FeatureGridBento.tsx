import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeatureBentoItem { icon?: string; title: string; description: string; span?: "wide" | "normal" }
export interface FeatureGridBentoProps { eyebrow?: string; heading?: string; subheading?: string; items?: FeatureBentoItem[] }

const defaults: FeatureBentoItem[] = [
  { icon: "Zap", title: "Instant setup", description: "Get up and running in minutes, not days.", span: "wide" },
  { icon: "ShieldCheck", title: "Secure by default", description: "Best-practice security out of the box." },
  { icon: "Layers3", title: "Composable", description: "Building blocks that fit your workflow." },
  { icon: "Gauge", title: "Built for speed", description: "Optimized at every layer for performance.", span: "wide" },
  { icon: "Users", title: "Team-ready", description: "Collaboration built in from day one." },
];

function icon(name?: string): LucideIcon { return (name && (Icons as unknown as Record<string, LucideIcon>)[name]) || Icons.Sparkles; }

export default function FeatureGridBento({ eyebrow = "Why teams choose us", heading = "Everything you need, nothing you don't", subheading, items = defaults }: FeatureGridBentoProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/65">{subheading}</p>}
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = icon(item.icon);
            return (
              <div
                key={item.title}
                className={`rounded-2xl border border-border bg-surface p-7 transition hover:border-accent/40 ${item.span === "wide" ? "sm:col-span-2" : ""}`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/65">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
