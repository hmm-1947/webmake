"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

export interface ComparisonPlan {
  name: string;
  highlighted?: boolean;
}

export interface ComparisonRow {
  feature: string;
  /** One value per plan, in the same order as `plans`. true/false render as
   * check/dash icons; strings render as-is (e.g. "500GB", "Unlimited"). */
  values: (boolean | string)[];
}

export interface ComparisonTableProps {
  heading?: string;
  subheading?: string;
  plans?: ComparisonPlan[];
  rows?: ComparisonRow[];
}

const defaultPlans: ComparisonPlan[] = [
  { name: "Starter" },
  { name: "Pro", highlighted: true },
  { name: "Enterprise" },
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
      <Check className="mx-auto h-4 w-4 text-accent" />
    ) : (
      <Minus className="mx-auto h-4 w-4 text-foreground/30" />
    );
  }
  return <span className="text-sm text-foreground/80">{value}</span>;
}

export default function ComparisonTable({
  heading = "Compare plans",
  subheading,
  plans = defaultPlans,
  rows = defaultRows,
}: ComparisonTableProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 overflow-x-auto"
        >
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-1/3 border-b border-border py-4 pr-4 text-sm font-medium text-foreground/60">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    className={`border-b py-4 px-4 text-center font-heading text-base font-semibold ${
                      plan.highlighted ? "border-accent text-accent" : "border-border"
                    }`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-border/60">
                  <td className="py-4 pr-4 text-sm text-foreground/80">{row.feature}</td>
                  {row.values.map((value, i) => (
                    <td
                      key={plans[i]?.name ?? i}
                      className={`py-4 px-4 text-center ${plans[i]?.highlighted ? "bg-accent/5" : ""}`}
                    >
                      <CellValue value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
