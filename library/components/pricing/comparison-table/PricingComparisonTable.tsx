import { Check } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  highlighted?: boolean;
}

export interface PricingComparisonTableProps {
  heading?: string;
  subheading?: string;
  tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  { name: "Starter", price: "$0", period: "/mo", features: ["Basic access"], ctaLabel: "Start free", ctaHref: "#" },
  { name: "Pro", price: "$29", period: "/mo", features: ["Everything in Starter", "Priority support"], ctaLabel: "Go Pro", ctaHref: "#", highlighted: true },
];

export default function PricingComparisonTable({
  heading = "Simple, transparent pricing",
  subheading,
  tiers = defaultTiers,
}: PricingComparisonTableProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 overflow-x-auto">
          <table className="mx-auto w-full max-w-4xl border-collapse">
            <thead>
              <tr>
                <th className="w-1/4"></th>
                {tiers.map((tier) => (
                  <th
                    key={tier.name}
                    className={`px-6 py-6 text-center align-bottom ${tier.highlighted ? "rounded-t-lg bg-primary text-primary-foreground" : ""}`}
                  >
                    <div className="font-heading text-lg font-semibold">{tier.name}</div>
                    <div className="mt-2 text-3xl font-bold">
                      {tier.price}
                      {tier.period && <span className="text-sm font-normal opacity-70">{tier.period}</span>}
                    </div>
                    {tier.description && <p className="mt-2 text-xs opacity-80">{tier.description}</p>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const allFeatures = Array.from(new Set(tiers.flatMap((t) => t.features ?? [])));
                return allFeatures.map((feature, i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-surface" : ""}>
                    <td className="px-4 py-4 text-sm text-foreground/70">{feature}</td>
                    {tiers.map((tier) => (
                      <td
                        key={tier.name + feature}
                        className={`px-6 py-4 text-center ${tier.highlighted ? "bg-primary/5" : ""}`}
                      >
                        {(tier.features ?? []).includes(feature) ? (
                          <Check className="mx-auto h-4 w-4 text-accent" />
                        ) : (
                          <span className="text-foreground/20">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ));
              })()}
              <tr>
                <td></td>
                {tiers.map((tier) => (
                  <td
                    key={tier.name + "-cta"}
                    className={`px-6 py-6 text-center ${tier.highlighted ? "rounded-b-lg bg-primary/5" : ""}`}
                  >
                    <Button href={tier.ctaHref ?? "#"} size="sm" variant={tier.highlighted ? "default" : "outline"}>
                      {tier.ctaLabel ?? "Choose"}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
