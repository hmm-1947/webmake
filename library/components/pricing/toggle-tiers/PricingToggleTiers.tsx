"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/generated/ui/button";

export interface PricingTier {
  name: string;
  monthlyPrice: string;
  yearlyPrice?: string;
  period?: string;
  description?: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  highlighted?: boolean;
}

export interface PricingToggleTiersProps {
  heading?: string;
  subheading?: string;
  tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  { name: "Starter", monthlyPrice: "$0", yearlyPrice: "$0", features: ["1 project", "Community support"], ctaLabel: "Start free" },
  { name: "Pro", monthlyPrice: "$29", yearlyPrice: "$24", features: ["Unlimited projects", "Priority support", "Advanced analytics"], ctaLabel: "Start trial", highlighted: true },
  { name: "Enterprise", monthlyPrice: "Custom", yearlyPrice: "Custom", features: ["SSO", "Dedicated support", "Custom SLAs"], ctaLabel: "Contact sales" },
];

export default function PricingToggleTiers({
  heading = "Simple, transparent pricing",
  subheading,
  tiers = defaultTiers,
}: PricingToggleTiersProps) {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={cn("text-sm font-medium", !yearly ? "text-foreground" : "text-foreground/50")}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((v) => !v)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              yearly ? "bg-accent" : "bg-border"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                yearly ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
          <span className={cn("text-sm font-medium", yearly ? "text-foreground" : "text-foreground/50")}>
            Yearly <span className="text-accent">(save ~20%)</span>
          </span>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col rounded-xl border p-8",
                tier.highlighted
                  ? "border-primary bg-surface shadow-lg ring-1 ring-primary"
                  : "border-border bg-background"
              )}
            >
              <h3 className="font-heading text-xl font-semibold">{tier.name}</h3>
              {tier.description && <p className="mt-2 text-sm text-foreground/70">{tier.description}</p>}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold">
                  {yearly ? tier.yearlyPrice ?? tier.monthlyPrice : tier.monthlyPrice}
                </span>
                {tier.monthlyPrice !== "Custom" && <span className="text-foreground/60">/mo</span>}
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                href={tier.ctaHref ?? "#"}
                variant={tier.highlighted ? "default" : "outline"}
                className="mt-8 w-full"
              >
                {tier.ctaLabel ?? "Choose plan"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
