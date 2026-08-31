"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Button from "@/components/generated/ui/button";

export interface CtaSplitImageProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export default function CtaSplitImage({
  heading = "Ready to get started?",
  subheading = "Join thousands of teams already using the platform.",
  ctaLabel = "Get Started",
  ctaHref = "#",
  imageUrl,
  imageAlt = "Promotional visual",
}: CtaSplitImageProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid items-center gap-10 overflow-hidden rounded-2xl border border-border bg-surface md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-10 md:p-14"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
            <p className="mt-4 max-w-md text-foreground/70">{subheading}</p>
            <div className="mt-8">
              <Button href={ctaHref} size="lg">
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {imageUrl && (
            <div className="relative h-64 md:h-full">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
