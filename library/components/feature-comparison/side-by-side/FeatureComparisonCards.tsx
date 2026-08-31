import { Check, X } from "lucide-react";

export interface ComparisonRow { feature: string; us: boolean | string; other: boolean | string }
export interface FeatureComparisonCardsProps { eyebrow?: string; heading?: string; usLabel?: string; otherLabel?: string; items?: ComparisonRow[] }

const defaultItems: ComparisonRow[] = [
  { feature: "Unlimited projects", us: true, other: false },
  { feature: "Priority support", us: true, other: false },
  { feature: "Custom integrations", us: true, other: "Limited" },
  { feature: "Team collaboration", us: true, other: true },
  { feature: "Advanced analytics", us: true, other: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-foreground/25" />;
  }
  return <span className="text-sm text-foreground/60">{value}</span>;
}

export default function FeatureComparisonCards({
  eyebrow = "Compare",
  heading = "See how we stack up",
  usLabel = "Us",
  otherLabel = "Others",
  items = defaultItems,
}: FeatureComparisonCardsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        </div>
        <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border bg-surface px-6 py-4 text-sm font-semibold">
            <span />
            <span className="w-20 text-center text-primary">{usLabel}</span>
            <span className="w-20 text-center text-foreground/50">{otherLabel}</span>
          </div>
          {items.map((row) => (
            <div key={row.feature} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border px-6 py-4 text-sm last:border-0">
              <span className="font-medium">{row.feature}</span>
              <span className="flex w-20 justify-center"><Cell value={row.us} /></span>
              <span className="flex w-20 justify-center"><Cell value={row.other} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
