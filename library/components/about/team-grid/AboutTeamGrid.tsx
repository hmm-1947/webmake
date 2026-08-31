import Image from "next/image";

export interface AboutTeamGridProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  members?: { name: string; role: string; imageUrl?: string }[];
}

const defaultMembers = [
  { name: "Alex Rivera", role: "Founder & CEO", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
  { name: "Jordan Lee", role: "Head of Design", imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80" },
  { name: "Sam Patel", role: "Lead Engineer", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { name: "Casey Kim", role: "Operations", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
];

export default function AboutTeamGrid({
  eyebrow = "Who we are",
  heading = "A small team, obsessed with the details",
  body = "We're a group of designers, engineers and strategists who believe great work comes from close collaboration and genuine craft.",
  members = defaultMembers,
}: AboutTeamGridProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-5xl">{heading}</h2>
          <p className="mt-5 text-lg leading-8 text-foreground/65">{body}</p>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {members.map((m) => (
            <div key={m.name} className="text-center">
              <div className="relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-2xl">
                <Image src={m.imageUrl || ""} alt={m.name} fill sizes="160px" className="object-cover" />
              </div>
              <p className="mt-4 font-heading font-semibold">{m.name}</p>
              <p className="text-sm text-foreground/55">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
