"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import Button from "@/components/generated/ui/button";

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
  /** One value per plan, in the same order as `plans`. */
  values: (boolean | string)[];
}

export interface ComparisonTieredCardsProps {
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
      <Check className="h-4 w-4 shrink-0 text-accent" />
    ) : (
      <Minus className="h-4 w-4 shrink-0 text-foreground/25" />
    );
  }
  return <span className="text-sm font-medium text-foreground/80">{value}</span>;
}

export default function ComparisonTieredCards({
  heading = "Compare plans",
  subheading,
  plans = defaultPlans,
  rows = defaultRows,
}: ComparisonTieredCardsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`flex flex-col rounded-xl border p-6 transition hover:shadow-lg ${
                plan.highlighted
                  ? "border-accent bg-accent/[0.04] shadow-md"
                  : "border-border bg-surface"
              }`}
            >
              <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
              {plan.price && (
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="font-heading text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-foreground/50">{plan.period}</span>}
                </p>
              )}

              <ul className="mt-6 flex-1 space-y-3">
                {rows.map((row) => (
                  <li key={row.feature} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-foreground/70">{row.feature}</span>
                    <CellValue value={row.values[i]} />
                  </li>
                ))}
              </ul>

              <Button
                href={plan.ctaHref ?? "#"}
                size="md"
                variant={plan.highlighted ? "default" : "outline"}
                className="mt-6 w-full justify-center"
              >
                {plan.ctaLabel ?? "Choose plan"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
