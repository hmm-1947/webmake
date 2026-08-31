"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCardGridProps {
  heading?: string;
  subheading?: string;
  items?: FaqItem[];
}

const defaultItems: FaqItem[] = [
  { question: "Can I cancel anytime?", answer: "Yes, you can cancel your subscription at any time from your account settings." },
  { question: "Do you offer a free trial?", answer: "Yes, every paid plan includes a 14-day free trial, no credit card required." },
  { question: "Is my data secure?", answer: "All data is encrypted in transit and at rest, and we run regular security audits." },
  { question: "Do you offer discounts for nonprofits?", answer: "Yes, reach out to our sales team for nonprofit and education pricing." },
];

export default function FaqCardGrid({
  heading = "Frequently asked questions",
  subheading,
  items = defaultItems,
}: FaqCardGridProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="rounded-xl border border-border bg-surface p-6 transition hover:border-accent/40 hover:shadow-md"
            >
              <HelpCircle className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-heading text-base font-semibold">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
