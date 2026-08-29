import { Github, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  platform: "github" | "twitter" | "linkedin" | "instagram" | "facebook";
  href: string;
}

export interface FooterMultiColumnProps {
  logoText?: string;
  tagline?: string;
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
}

const iconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
};

const defaultColumns: FooterColumn[] = [
  { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
];

export default function FooterMultiColumn({
  logoText = "Brand",
  tagline,
  columns = defaultColumns,
  socialLinks = [],
}: FooterMultiColumnProps) {
  return (
    <footer className="border-t border-border py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="font-heading text-lg font-bold">{logoText}</div>
            {tagline && <p className="mt-3 max-w-xs text-sm text-foreground/60">{tagline}</p>}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex gap-4">
                {socialLinks.map((s) => {
                  const Icon = iconMap[s.platform];
                  return (
                    <a key={s.platform} href={s.href} className="text-foreground/50 hover:text-foreground">
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-foreground/60 hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} {logoText}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
