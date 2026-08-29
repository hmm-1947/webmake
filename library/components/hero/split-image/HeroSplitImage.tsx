"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface HeroSplitImageProps {
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

export default function HeroSplitImage({
  eyebrow,
  heading = "Build something great",
  subheading = "A clear, compelling description of the product goes here.",
  primaryCtaLabel = "Get Started",
  primaryCtaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref = "#",
  imageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  imageAlt = "Product preview",
}: HeroSplitImageProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {eyebrow && (
            <span className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              {eyebrow}
            </span>
          )}
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/70">{subheading}</p>
          <div className="mt-8 flex flex-wrap gap-4">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border shadow"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
