"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface HeroCenteredProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export default function HeroCentered({
  eyebrow,
  heading = "Build something great",
  subheading = "A clear, compelling description of the product goes here.",
  primaryCtaLabel = "Get Started",
  primaryCtaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref = "#",
  imageUrl,
  imageAlt = "Preview",
}: HeroCenteredProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />
      <div className="container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <span className="mb-5 inline-block rounded-full border border-border bg-surface px-4 py-1 text-sm font-medium text-accent">
              {eyebrow}
            </span>
          )}
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            {heading}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/70">{subheading}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href={primaryCtaHref} size="lg">
              {primaryCtaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {secondaryCtaLabel && (
              <Button href={secondaryCtaHref} size="lg" variant="outline">
                {secondaryCtaLabel}
              </Button>
            )}
          </div>
        </motion.div>

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-16 aspect-video w-full max-w-4xl overflow-hidden rounded-xl border border-border shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
