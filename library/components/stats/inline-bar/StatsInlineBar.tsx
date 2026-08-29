"use client";

import { motion } from "framer-motion";

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsInlineBarProps {
  heading?: string;
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { value: "12+", label: "Years" },
  { value: "40+", label: "Projects" },
  { value: "99%", label: "Retention" },
];

export default function StatsInlineBar({ heading, stats = defaultStats }: StatsInlineBarProps) {
  return (
    <section className="border-y border-border py-12">
      <div className="container">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-semibold">{heading}</h2>
        )}
        <div className="flex flex-wrap items-center justify-center divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center px-8 py-2 first:pl-0 last:pr-0"
            >
              <span className="font-heading text-2xl font-bold text-accent">{stat.value}</span>
              <span className="mt-1 text-xs uppercase tracking-wide text-foreground/60">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
