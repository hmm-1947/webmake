import { Github, Linkedin, Twitter } from "lucide-react";

export interface SimpleLink {
  label: string;
  href: string;
}

export interface FooterSplitSocialProps {
  logoText?: string;
  tagline?: string;
  links?: SimpleLink[];
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

export default function FooterSplitSocial({
  logoText = "Brand",
  tagline,
  links = [],
  githubUrl,
  twitterUrl,
  linkedinUrl,
}: FooterSplitSocialProps) {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div>
          <div className="font-heading text-lg font-bold">{logoText}</div>
          {tagline && <p className="mt-1 max-w-xs text-sm text-foreground/60">{tagline}</p>}
        </div>

        {links.length > 0 && (
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-foreground/70 hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {githubUrl && (
            <a href={githubUrl} aria-label="GitHub" className="text-foreground/50 transition hover:text-accent">
              <Github className="h-4 w-4" />
            </a>
          )}
          {twitterUrl && (
            <a href={twitterUrl} aria-label="Twitter" className="text-foreground/50 transition hover:text-accent">
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} aria-label="LinkedIn" className="text-foreground/50 transition hover:text-accent">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="container mt-6 border-t border-border/60 pt-6 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} {logoText}. All rights reserved.
      </div>
    </footer>
  );
}
