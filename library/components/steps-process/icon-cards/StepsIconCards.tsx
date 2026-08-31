"use client";

import { motion } from "framer-motion";
import { Lightbulb, PenTool, Rocket, Wrench, type LucideIcon } from "lucide-react";

export interface StepItem {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export interface StepsIconCardsProps {
  heading?: string;
  subheading?: string;
  steps?: StepItem[];
}

const defaultSteps: StepItem[] = [
  { title: "Discover", description: "We learn your business, users, and constraints.", icon: Lightbulb },
  { title: "Design", description: "Wireframes and high-fidelity prototypes you can test.", icon: PenTool },
  { title: "Build", description: "Production-grade code, shipped in weekly increments.", icon: Wrench },
  { title: "Launch", description: "We stay on to support your first release and beyond.", icon: Rocket },
];

export default function StepsIconCards({
  heading = "How it works",
  subheading,
  steps = defaultSteps,
}: StepsIconCardsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon ?? Lightbulb;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-foreground/40">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 font-heading text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
