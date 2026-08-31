"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface TestimonialItem {
  quote: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
}

export interface TestimonialsCarouselProps {
  heading?: string;
  subheading?: string;
  items?: TestimonialItem[];
}

const defaultItems: TestimonialItem[] = [
  { quote: "This completely changed how our team ships. We moved from monthly to weekly releases within a quarter.", authorName: "Alex Rivera", authorRole: "CTO, Northwind" },
  { quote: "Setup took minutes, not weeks. Our whole team was onboarded before lunch.", authorName: "Priya Menon", authorRole: "Founder, Loopline" },
  { quote: "The best tool we've adopted this year, hands down.", authorName: "Sam Okafor", authorRole: "Head of Product, Vela" },
];

export default function TestimonialsCarousel({
  heading = "Loved by teams everywhere",
  subheading,
  items = defaultItems,
}: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);
  const current = items[index];

  const go = (delta: number) => {
    setIndex((i) => (i + delta + items.length) % items.length);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="relative mx-auto mt-14 max-w-2xl">
          <Quote className="mx-auto h-8 w-8 text-accent/40" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center"
            >
              <blockquote className="text-xl font-medium leading-relaxed sm:text-2xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-3">
                {current.avatarUrl ? (
                  <Image
                    src={current.avatarUrl}
                    alt={`Photo of ${current.authorName}`}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
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
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition hover:border-accent hover:text-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                {items.map((item, i) => (
                  <button
                    key={item.authorName}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-accent" : "w-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition hover:border-accent hover:text-accent"
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
