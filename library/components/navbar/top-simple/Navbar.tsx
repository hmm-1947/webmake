"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logoText?: string;
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function Navbar({
  logoText = "Brand",
  links = [],
  ctaLabel = "Get Started",
  ctaHref = "#",
}: NavbarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="font-heading text-lg font-bold tracking-tight">
          {logoText}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href={ctaHref} size="sm">
            {ctaLabel}
          </Button>
        </div>

        <button
          className="inline-flex items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border md:hidden">
          <div className="container flex flex-col gap-4 py-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium">
                {link.label}
              </a>
            ))}
            <Button href={ctaHref} size="sm" className="w-full">
              {ctaLabel}
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
