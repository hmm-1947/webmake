export interface SimpleLink {
  label: string;
  href: string;
}

export interface FooterSimpleCenteredProps {
  logoText?: string;
  tagline?: string;
  links?: SimpleLink[];
}

export default function FooterSimpleCentered({
  logoText = "Brand",
  tagline,
  links = [],
}: FooterSimpleCenteredProps) {
  return (
    <footer className="border-t border-border py-12">
      <div className="container flex flex-col items-center gap-4 text-center">
        <div className="font-heading text-lg font-bold">{logoText}</div>
        {tagline && <p className="max-w-sm text-sm text-foreground/60">{tagline}</p>}
        {links.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-foreground/70 hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>
        )}
        <div className="mt-4 text-xs text-foreground/50">
          © {new Date().getFullYear()} {logoText}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
