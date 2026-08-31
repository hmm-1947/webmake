"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
}

export interface TeamCompactGridProps {
  heading?: string;
  subheading?: string;
  members?: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  { name: "Jordan Lee", role: "CEO" },
  { name: "Priya Nair", role: "CTO" },
  { name: "Sam Torres", role: "Design" },
  { name: "Casey Kim", role: "Growth" },
  { name: "Riley Chen", role: "Engineering" },
  { name: "Morgan Blake", role: "Sales" },
];

export default function TeamCompactGrid({
  heading = "Meet the team",
  subheading,
  members = defaultMembers,
}: TeamCompactGridProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex flex-col items-center rounded-lg border border-border bg-surface p-4 text-center transition hover:border-accent/40"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-background">
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={`Photo of ${member.name}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-accent">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold">{member.name}</h3>
              <p className="text-xs text-foreground/50">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
