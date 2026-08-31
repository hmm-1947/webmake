import Image from "next/image";

export interface LogoItem {
  name: string;
  imageUrl: string;
}

export interface LogoCloudBorderedGridProps {
  heading?: string;
  logos?: LogoItem[];
}

const defaultLogos: LogoItem[] = [
  { name: "Orbital", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Orbital" },
  { name: "Lattice", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Lattice" },
  { name: "Vantage", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Vantage" },
  { name: "Fernwood", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Fernwood" },
  { name: "Cascade", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Cascade" },
  { name: "Meridian", imageUrl: "https://dummyimage.com/120x40/999/fff&text=Meridian" },
];

export default function LogoCloudBorderedGrid({
  heading = "Trusted by teams at",
  logos = defaultLogos,
}: LogoCloudBorderedGridProps) {
  return (
    <section className="py-16">
      <div className="container">
        {heading && (
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-foreground/50">
            {heading}
          </p>
        )}
        <div className="grid grid-cols-2 divide-x divide-y divide-border border border-border sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center px-6 py-8 transition hover:bg-surface"
            >
              <Image
                src={logo.imageUrl}
                alt={`${logo.name} logo`}
                width={110}
                height={36}
                className="h-7 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
