"use client";
import { useState } from "react";
import { Calendar, Users, Search } from "lucide-react";

export interface BookingSearchCompactProps {
  heading?: string;
  partyLabel?: string;
  submitLabel?: string;
}

export default function BookingSearchCompact({
  heading = "Find your table",
  partyLabel = "2 guests",
  submitLabel = "Check availability",
}: BookingSearchCompactProps) {
  const [party, setParty] = useState(partyLabel);
  return (
    <section className="py-14">
      <div className="container">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center">
          {heading && <p className="hidden font-heading text-sm font-semibold sm:block sm:pr-2">{heading}</p>}
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
            <Calendar className="h-4 w-4 text-foreground/50" />
            <input type="date" aria-label="Date" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
            <Users className="h-4 w-4 text-foreground/50" />
            <input
              value={party}
              onChange={(e) => setParty(e.target.value)}
              aria-label="Party size"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            <Search className="h-4 w-4" />
            {submitLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
