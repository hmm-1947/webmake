"use client";

import { motion } from "framer-motion";

export interface StepItem {
  title: string;
  description: string;
}

export interface StepsNumberedProps {
  heading?: string;
  subheading?: string;
  steps?: StepItem[];
}

const defaultSteps: StepItem[] = [
  { title: "Sign up", description: "Create your account in under a minute — no credit card required." },
  { title: "Connect your tools", description: "Link the services your team already uses." },
  { title: "Invite your team", description: "Bring everyone in and assign roles." },
  { title: "Ship", description: "Start shipping faster with everything in one place." },
];

export default function StepsNumbered({
  heading = "How it works",
  subheading,
  steps = defaultSteps,
}: StepsNumberedProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-border lg:block"
          />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background font-heading text-lg font-semibold text-accent">
                {i + 1}
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
