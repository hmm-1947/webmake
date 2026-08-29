"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeaturesGrid3Props {
  heading?: string;
  subheading?: string;
  items?: FeatureItem[];
}

function resolveIcon(name?: string): LucideIcon {
  if (!name) return Icons.Sparkles;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? Icons.Sparkles;
}

const defaultItems: FeatureItem[] = [
  { icon: "Zap", title: "Fast by default", description: "Optimized out of the box, no extra config needed." },
  { icon: "ShieldCheck", title: "Secure", description: "Best practices baked in from the start." },
  { icon: "Layers", title: "Composable", description: "Every piece is designed to work with the rest." },
];

export default function FeaturesGrid3({
  heading = "Everything you need",
  subheading,
  items = defaultItems,
}: FeaturesGrid3Props) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
