"use client";
import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";

export interface NewsletterCenteredBannerProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  privacyText?: string;
}

export default function NewsletterCenteredBanner({
  eyebrow = "Newsletter",
  heading = "Join thousands getting our best ideas first",
  subheading = "One thoughtful email, no spam, unsubscribe whenever you like.",
  buttonLabel = "Get updates",
  privacyText = "We respect your privacy.",
}: NewsletterCenteredBannerProps) {
  const [done, setDone] = useState(false);
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(60%_60%_at_50%_0%,white,transparent)]" />
      <div className="container relative mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10">
          <Mail className="h-5 w-5" />
        </span>
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary-foreground/70">{eyebrow}</p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-5xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-md text-primary-foreground/70">{subheading}</p>

        {done ? (
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-3 rounded-xl bg-primary-foreground/10 p-5">
            <Check className="h-5 w-5" />
            <p className="font-medium">You're subscribed — welcome aboard.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              required
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/50 outline-none transition focus:ring-2 focus:ring-primary-foreground/40"
            />
            <button className="inline-flex items-center justify-center rounded-lg bg-primary-foreground px-5 py-3 font-medium text-primary transition hover:opacity-90">
              {buttonLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-primary-foreground/50">{privacyText}</p>
      </div>
    </section>
  );
}
