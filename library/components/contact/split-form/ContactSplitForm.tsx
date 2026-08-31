"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface ContactSplitFormProps {
  heading?: string;
  subheading?: string;
  email?: string;
  phone?: string;
  address?: string;
  submitLabel?: string;
  /** Where the form POSTs to. Point this at your own API route or a form
   * backend (e.g. Formspree, Resend) — this component does not send email
   * itself, it only collects and submits the fields. */
  action?: string;
}

export default function ContactSplitForm({
  heading = "Get in touch",
  subheading = "We'd love to hear from you. Fill out the form and we'll respond within one business day.",
  email,
  phone,
  address,
  submitLabel = "Send message",
  action = "#",
}: ContactSplitFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (action === "#") {
      e.preventDefault();
      setStatus("sent");
    }
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container grid gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          <p className="mt-4 max-w-md text-foreground/70">{subheading}</p>

          <div className="mt-8 space-y-4">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-foreground/80 hover:text-accent">
                <Mail className="h-4 w-4 shrink-0" />
                {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm text-foreground/80 hover:text-accent">
                <Phone className="h-4 w-4 shrink-0" />
                {phone}
              </a>
            )}
            {address && (
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <MapPin className="h-4 w-4 shrink-0" />
                {address}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {status === "sent" ? (
            <div className="rounded-lg border border-border bg-surface p-8 text-center">
              <p className="font-heading text-lg font-semibold">Thanks — message sent.</p>
              <p className="mt-2 text-sm text-foreground/70">We&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form action={action} method="POST" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-accent/40 focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-accent/40 focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full resize-none rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-accent/40 focus:ring-2"
                />
              </div>
              <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
                {status === "submitting" ? "Sending..." : submitLabel}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
