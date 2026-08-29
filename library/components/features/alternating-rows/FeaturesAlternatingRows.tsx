"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeaturesAlternatingRowsProps {
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

export default function FeaturesAlternatingRows({
  heading = "Everything you need",
  subheading,
  items = defaultItems,
}: FeaturesAlternatingRowsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 flex flex-col gap-16">
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col items-center gap-8 md:flex-row ${reversed ? "md:flex-row-reverse" : ""}`}
              >
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-12 w-12" />
                </div>
                <div className={`flex-1 text-center ${reversed ? "md:text-right" : "md:text-left"}`}>
                  <h3 className="font-heading text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-foreground/70">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
