"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import Button from "@/components/generated/ui/button";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarCenteredLogoProps {
  logoText?: string; links?: NavLink[]; ctaLabel?: string; ctaHref?: string;
  announcement?: string; showSearch?: boolean; showThemeToggle?: boolean; activeHref?: string;
  utilityLinks?: NavLink[]; mobileCtaLabel?: string;
}

export default function NavbarCenteredLogo({logoText = "Brand",links = [],ctaLabel = "Get Started",ctaHref = "#",announcement,showSearch = false,showThemeToggle = false,activeHref,utilityLinks = [],mobileCtaLabel}: NavbarCenteredLogoProps) {
  const half = Math.ceil(links.length / 2);
  const leftLinks = links.slice(0, half);
  const rightLinks = links.slice(half);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between md:grid md:grid-cols-3">
        <nav className="hidden items-center justify-start gap-8 md:flex">
          {leftLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="/" className="font-heading text-lg font-bold tracking-tight md:text-center">
          {logoText}
        </a>

        <div className="hidden items-center justify-end gap-8 md:flex">
          {rightLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
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
