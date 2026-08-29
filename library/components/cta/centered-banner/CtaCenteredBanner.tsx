import Button from "@/components/generated/ui/button";

export interface CtaCenteredBannerProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function CtaCenteredBanner({
  heading = "Ready to get started?",
  subheading = "Join thousands of teams already using the platform.",
  ctaLabel = "Get Started",
  ctaHref = "#",
}: CtaCenteredBannerProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col items-center rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          <p className="mt-4 max-w-xl text-primary-foreground/80">{subheading}</p>
          <div className="mt-8">
            <Button href={ctaHref} size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
