"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface ContactCenteredSimpleProps {
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

export default function ContactCenteredSimple({
  heading = "Let's talk",
  subheading = "Send a message and we'll get back to you within one business day.",
  email,
  phone,
  address,
  submitLabel = "Send message",
  action = "#",
}: ContactCenteredSimpleProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (action === "#") {
      e.preventDefault();
      setStatus("sent");
    }
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-foreground/70">{subheading}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-12 max-w-xl rounded-xl border border-border bg-surface p-6 sm:p-8"
        >
          {status === "sent" ? (
            <div className="py-6 text-center">
              <p className="font-heading text-lg font-semibold">Thanks — message sent.</p>
              <p className="mt-2 text-sm text-foreground/70">We&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form action={action} method="POST" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
              <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full justify-center">
                {status === "submitting" ? "Sending..." : submitLabel}
              </Button>
            </form>
          )}
        </motion.div>

        {(email || phone || address) && (
          <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-accent">
                <Mail className="h-4 w-4" />
                {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-accent">
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            )}
            {address && (
              <span className="flex items-center gap-2 text-sm text-foreground/70">
                <MapPin className="h-4 w-4" />
                {address}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
