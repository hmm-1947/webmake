"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus } from "lucide-react";
import Button from "@/components/generated/ui/button";
import { cn } from "@/lib/utils";

export interface ComparisonPlan {
  name: string;
  price?: string;
  period?: string;
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface ComparisonRow {
  feature: string;
  values: (boolean | string)[];
}

export interface ComparisonPlanTabsProps {
  heading?: string;
  subheading?: string;
  plans?: ComparisonPlan[];
  rows?: ComparisonRow[];
}

const defaultPlans: ComparisonPlan[] = [
  { name: "Starter", price: "$0", period: "/mo", ctaLabel: "Start free" },
  { name: "Pro", price: "$29", period: "/mo", highlighted: true, ctaLabel: "Start trial" },
  { name: "Enterprise", price: "Custom", ctaLabel: "Contact sales" },
];

const defaultRows: ComparisonRow[] = [
  { feature: "Projects", values: ["1", "Unlimited", "Unlimited"] },
  { feature: "Team members", values: ["3", "20", "Unlimited"] },
  { feature: "Priority support", values: [false, true, true] },
  { feature: "SSO & SCIM", values: [false, false, true] },
  { feature: "Custom SLAs", values: [false, false, true] },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-4 w-4 text-accent" />
    ) : (
      <Minus className="h-4 w-4 text-foreground/25" />
    );
  }
  return <span className="text-sm font-medium text-foreground/80">{value}</span>;
}

export default function ComparisonPlanTabs({
  heading = "Compare plans",
  subheading,
  plans = defaultPlans,
  rows = defaultRows,
}: ComparisonPlanTabsProps) {
  const [active, setActive] = useState(0);
  const plan = plans[active];

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="flex rounded-lg border border-border p-1">
            {plans.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "flex-1 rounded-md py-2 text-sm font-medium transition",
                  active === i ? "bg-accent text-white" : "text-foreground/60 hover:text-foreground"
                )}
              >
                {p.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-6 rounded-xl border border-border bg-surface p-6"
            >
              {plan.price && (
                <p className="flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-foreground/50">{plan.period}</span>}
                </p>
              )}
              <ul className="mt-6 space-y-3">
                {rows.map((row) => (
                  <li key={row.feature} className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 text-sm">
                    <span className="text-foreground/70">{row.feature}</span>
                    <CellValue value={row.values[active]} />
                  </li>
                ))}
              </ul>
              <Button href={plan.ctaHref ?? "#"} className="mt-6 w-full justify-center">
                {plan.ctaLabel ?? "Choose plan"}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
