"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface HeroGradientMinimalProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export default function HeroGradientMinimal({
  eyebrow,
  heading = "Build something great",
  subheading = "A clear, compelling description of the product goes here.",
  primaryCtaLabel = "Get Started",
  primaryCtaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref = "#",
}: HeroGradientMinimalProps) {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-accent/30 via-accent/10 to-transparent blur-3xl"
      />
      <div className="container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {eyebrow && (
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </span>
          )}
          <h1 className="mx-auto max-w-4xl font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/70">{subheading}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href={primaryCtaHref} size="lg">
              {primaryCtaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {secondaryCtaLabel && (
              <Button href={secondaryCtaHref} size="lg" variant="ghost">
                {secondaryCtaLabel}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
