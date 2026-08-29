"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface TestimonialItem {
  quote: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
}

export interface TestimonialsSingleLargeProps {
  heading?: string;
  subheading?: string;
  items?: TestimonialItem[];
}

const defaultItems: TestimonialItem[] = [
  { quote: "This completely changed how our team ships.", authorName: "Alex Rivera", authorRole: "CTO, Northwind" },
  { quote: "Setup took minutes, not weeks.", authorName: "Priya Menon", authorRole: "Founder, Loopline" },
];

export default function TestimonialsSingleLarge({
  heading = "Loved by teams everywhere",
  subheading,
  items = defaultItems,
}: TestimonialsSingleLargeProps) {
  const [index, setIndex] = useState(0);
  const current = items[index] ?? items[0];

  const go = (dir: 1 | -1) => {
    setIndex((prev) => (prev + dir + items.length) % items.length);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mx-auto mt-16 max-w-3xl text-center">
          <Quote className="mx-auto h-10 w-10 text-accent/40" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <blockquote className="mt-6 font-heading text-2xl font-medium leading-snug sm:text-3xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center justify-center gap-3">
                {current.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={current.avatarUrl} alt={current.authorName} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                    {current.authorName.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-sm font-semibold">{current.authorName}</div>
                  {current.authorRole && <div className="text-xs text-foreground/60">{current.authorRole}</div>}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {items.map((t, i) => (
                  <button
                    key={t.authorName}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 w-2 rounded-full ${i === index ? "bg-accent" : "bg-border"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
