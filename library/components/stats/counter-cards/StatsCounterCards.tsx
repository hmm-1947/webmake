"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsCounterCardsProps {
  heading?: string;
  subheading?: string;
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { value: "10000+", label: "Active teams" },
  { value: "99.99", label: "Uptime %" },
  { value: "4.9", label: "Average rating" },
  { value: "24", label: "Support (hrs/day)" },
];

function Counter({ target }: { target: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function StatsCounterCards({
  heading,
  subheading,
  stats = defaultStats,
}: StatsCounterCardsProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {(heading || subheading) && (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {heading && (
              <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h2>
            )}
            {subheading && <p className="mt-3 text-foreground/70">{subheading}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => {
            const numeric = parseFloat(s.value.replace(/[^0-9.]/g, ""));
            const suffix = s.value.replace(/^[0-9.]+/, "");
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-surface p-6 text-center transition hover:shadow-md"
              >
                <span className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                  {Number.isFinite(numeric) ? <Counter target={numeric} /> : s.value}
                  {Number.isFinite(numeric) ? suffix : ""}
                </span>
                <p className="mt-2 text-sm text-foreground/60">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
