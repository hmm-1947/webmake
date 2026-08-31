"use client";

import Image from "next/image";

export interface LogoItem {
  name: string;
  logoUrl?: string;
}

export interface LogoCloudMarqueeProps {
  heading?: string;
  logos?: LogoItem[];
}

const defaultLogos: LogoItem[] = [
  { name: "Acme" },
  { name: "Northwind" },
  { name: "Vela" },
  { name: "Loopline" },
];

export default function LogoCloudMarquee({ heading, logos = defaultLogos }: LogoCloudMarqueeProps) {
  const doubled = [...logos, ...logos];

  return (
    <section className="py-16">
      <div className="container">
        {heading && (
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wide text-foreground/50">
            {heading}
          </p>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div className="flex w-max animate-[marquee_25s_linear_infinite] gap-16">
          {doubled.map((logo, i) => (
            <div key={logo.name + i} className="flex shrink-0 items-center justify-center">
              {logo.logoUrl ? (
                <Image
                  src={logo.logoUrl}
                  alt={`${logo.name} logo`}
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-60 grayscale"
                />
              ) : (
                <span className="text-lg font-heading font-semibold text-foreground/40">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
