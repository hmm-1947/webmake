"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Twitter, Globe } from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export interface TeamGrid4Props {
  heading?: string;
  subheading?: string;
  members?: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  { name: "Jordan Lee", role: "Co-founder & CEO" },
  { name: "Priya Nair", role: "Co-founder & CTO" },
  { name: "Sam Torres", role: "Head of Design" },
  { name: "Casey Kim", role: "Head of Growth" },
];

export default function TeamGrid4({
  heading = "Meet the team",
  subheading,
  members = defaultMembers,
}: TeamGrid4Props) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="text-center"
            >
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-border bg-surface">
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={`Photo of ${member.name}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-accent">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold">{member.name}</h3>
              <p className="text-sm text-foreground/60">{member.role}</p>
              {member.bio && (
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{member.bio}</p>
              )}
              {(member.linkedinUrl || member.twitterUrl || member.websiteUrl) && (
                <div className="mt-3 flex items-center justify-center gap-3">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      aria-label={`${member.name} on LinkedIn`}
                      className="text-foreground/50 transition hover:text-accent"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.twitterUrl && (
                    <a
                      href={member.twitterUrl}
                      aria-label={`${member.name} on Twitter`}
                      className="text-foreground/50 transition hover:text-accent"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {member.websiteUrl && (
                    <a
                      href={member.websiteUrl}
                      aria-label={`${member.name}'s website`}
                      className="text-foreground/50 transition hover:text-accent"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
