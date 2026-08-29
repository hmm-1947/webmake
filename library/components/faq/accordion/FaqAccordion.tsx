"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  heading?: string;
  items?: FaqItem[];
}

const defaultItems: FaqItem[] = [
  { question: "Can I cancel anytime?", answer: "Yes, you can cancel your subscription at any time from your account settings." },
  { question: "Do you offer a free trial?", answer: "Yes, every paid plan includes a 14-day free trial, no credit card required." },
  { question: "Is my data secure?", answer: "All data is encrypted in transit and at rest, and we run regular security audits." },
];

export default function FaqAccordion({
  heading = "Frequently asked questions",
  items = defaultItems,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-center font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-12 divide-y divide-border border-t border-b border-border">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  className="flex w-full items-center justify-between py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{item.question}</span>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-foreground/50 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <div className="pb-5 text-sm leading-relaxed text-foreground/70">{item.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
