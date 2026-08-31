"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

export interface ContactInlineMinimalProps {
  heading?: string;
  subheading?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function ContactInlineMinimal({
  heading = "Say hello",
  subheading = "Prefer email? Reach out directly and we'll get back to you within a day.",
  email,
  phone,
  address,
}: ContactInlineMinimalProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">{heading}</h2>
          <p className="mt-4 text-lg text-foreground/70">{subheading}</p>

          {email && (
            <a
              href={`mailto:${email}`}
              className="group mt-8 inline-flex items-center gap-2 font-heading text-2xl font-semibold text-accent transition sm:text-3xl"
            >
              {email}
              <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}

          {(phone || address) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-foreground/60">
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-accent">
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              )}
              {address && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {address}
                </span>
              )}
              {!phone && !address && email && (
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  We usually reply within one business day
                </span>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
