"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BentoFeatureItem {
  icon?: string;
  title: string;
  description: string;
  span?: "1" | "2";
}

export interface FeaturesBentoGridProps {
  heading?: string;
  subheading?: string;
  items?: BentoFeatureItem[];
}

function resolveIcon(name?: string): LucideIcon {
  if (!name) return Icons.Sparkles;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? Icons.Sparkles;
}

const defaultItems: BentoFeatureItem[] = [
  { icon: "Cpu", title: "Built for scale", description: "Handles millions of events without breaking a sweat.", span: "2" },
  { icon: "GitBranch", title: "Version everything", description: "Full history, instant rollback." },
  { icon: "Lock", title: "Zero-trust security", description: "Every request verified, every time." },
  { icon: "Globe", title: "Global edge network", description: "Sub-50ms latency worldwide." },
];

export default function FeaturesBentoGrid({
  heading = "Built different",
  subheading,
  items = defaultItems,
}: FeaturesBentoGridProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={cn(
                  "rounded-xl border border-border bg-surface p-8",
                  item.span === "2" && "sm:col-span-2"
                )}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
