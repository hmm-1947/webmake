export interface LogoItem {
  name: string;
  imageUrl: string;
}

export interface LogoCloudRowProps {
  heading?: string;
  logos?: LogoItem[];
}

const defaultLogos: LogoItem[] = [
  { name: "Orbital", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Orbital" },
  { name: "Lattice", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Lattice" },
  { name: "Vantage", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Vantage" },
  { name: "Fernwood", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Fernwood" },
];

export default function LogoCloudRow({
  heading = "Trusted by teams at",
  logos = defaultLogos,
}: LogoCloudRowProps) {
  return (
    <section className="py-12">
      <div className="container">
        {heading && (
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-foreground/50">
            {heading}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={logo.name}
              src={logo.imageUrl}
              alt={logo.name}
              className="h-8 w-auto opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
