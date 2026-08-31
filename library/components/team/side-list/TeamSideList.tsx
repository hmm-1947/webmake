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

export interface TeamSideListProps {
  heading?: string;
  subheading?: string;
  members?: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  {
    name: "Jordan Lee",
    role: "Co-founder & CEO",
    bio: "Previously led product at two Series B startups. Obsessed with clean systems.",
  },
  {
    name: "Priya Nair",
    role: "Co-founder & CTO",
    bio: "Full-stack engineer turned architect. Ships fast, breaks nothing.",
  },
  {
    name: "Sam Torres",
    role: "Head of Design",
    bio: "Design systems nerd. Believes great UI is invisible.",
  },
];

export default function TeamSideList({
  heading = "Meet the team",
  subheading,
  members = defaultMembers,
}: TeamSideListProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-14 divide-y divide-border border-t border-border">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={`Photo of ${member.name}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-accent">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-heading text-lg font-semibold">{member.name}</h3>
                  <span className="text-sm text-accent">{member.role}</span>
                </div>
                {member.bio && (
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-foreground/70">{member.bio}</p>
                )}
              </div>

              {(member.linkedinUrl || member.twitterUrl || member.websiteUrl) && (
                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:gap-3">
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
