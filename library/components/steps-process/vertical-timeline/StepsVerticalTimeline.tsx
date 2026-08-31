"use client";

import { motion } from "framer-motion";

export interface StepItem {
  title: string;
  description: string;
}

export interface StepsVerticalTimelineProps {
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

export default function StepsVerticalTimeline({
  heading = "How it works",
  subheading,
  steps = defaultSteps,
}: StepsVerticalTimelineProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="relative mx-auto mt-16 max-w-2xl">
          <div
            aria-hidden
            className="absolute left-6 top-2 bottom-2 w-px bg-border"
          />
          <div className="space-y-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex gap-6 pl-0"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-background font-heading text-lg font-semibold text-accent">
                  {i + 1}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-heading text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
