"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarFloatingPillProps {
  logoText?: string;
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function NavbarFloatingPill({
  logoText = "Brand",
  links = [],
  ctaLabel = "Get Started",
  ctaHref = "#",
}: NavbarFloatingPillProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-4 z-50 w-full px-4">
      <div className="container flex h-14 items-center justify-between rounded-full border border-border bg-background/90 px-5 shadow-sm backdrop-blur">
        <a href="/" className="font-heading text-base font-bold tracking-tight">
          {logoText}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href={ctaHref} size="sm" className="rounded-full">
            {ctaLabel}
          </Button>
        </div>

        <button
          className="inline-flex items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="container mt-2 rounded-2xl border border-border bg-background p-4 shadow-sm md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium">
                {link.label}
              </a>
            ))}
            <Button href={ctaHref} size="sm" className="w-full rounded-full">
              {ctaLabel}
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
