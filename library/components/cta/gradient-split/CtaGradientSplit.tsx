"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface CtaStat {
  value: string;
  label: string;
}

export interface CtaGradientSplitProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  stats?: CtaStat[];
}

const defaultStats: CtaStat[] = [
  { value: "10k+", label: "Teams onboard" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Support" },
];

export default function CtaGradientSplit({
  heading = "Ready to get started?",
  subheading = "Join thousands of teams already using the platform to ship faster.",
  ctaLabel = "Get Started",
  ctaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref = "#",
  stats = defaultStats,
}: CtaGradientSplitProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent px-8 py-14 sm:px-14"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                {heading}
              </h2>
              <p className="mt-4 max-w-lg text-primary-foreground/80">{subheading}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  href={ctaHref}
                  size="lg"
                  className="bg-primary-foreground text-primary hover:opacity-90"
                >
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {secondaryCtaLabel && (
                  <Button
                    href={secondaryCtaHref}
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    {secondaryCtaLabel}
                  </Button>
                )}
              </div>
            </div>

            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-primary-foreground/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
