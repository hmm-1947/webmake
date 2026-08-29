"use client";

import { motion } from "framer-motion";

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsRow4Props {
  heading?: string;
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { value: "10k+", label: "Active teams" },
  { value: "99.99%", label: "Uptime" },
  { value: "4.9/5", label: "Average rating" },
  { value: "24/7", label: "Support" },
];

export default function StatsRow4({ heading, stats = defaultStats }: StatsRow4Props) {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {heading && (
          <h2 className="mb-12 text-center font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <span className="font-heading text-4xl font-bold text-primary sm:text-5xl">
                {s.value}
              </span>
              <span className="mt-2 text-sm text-foreground/60">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
