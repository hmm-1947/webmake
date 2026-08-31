"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryItem {
  imageUrl: string;
  title?: string;
  category?: string;
}

export interface GalleryScrollCarouselProps {
  heading?: string;
  subheading?: string;
  items?: GalleryItem[];
}

const defaultItems: GalleryItem[] = [
  { imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", title: "Project One", category: "Branding" },
  { imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80", title: "Project Two", category: "Web" },
  { imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", title: "Project Three", category: "Product" },
  { imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", title: "Project Four", category: "Branding" },
];

export default function GalleryScrollCarousel({
  heading = "Selected work",
  subheading,
  items = defaultItems,
}: GalleryScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
            {subheading && <p className="mt-3 max-w-md text-foreground/70">{subheading}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-accent hover:text-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-accent hover:text-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.imageUrl}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative aspect-[4/3] w-[85vw] shrink-0 snap-start overflow-hidden rounded-lg border border-border sm:w-[340px]"
            >
              <Image
                src={item.imageUrl}
                alt={item.title ?? "Portfolio image"}
                fill
                sizes="340px"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              {(item.title || item.category) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  {item.category && (
                    <p className="text-xs font-medium uppercase tracking-wide text-white/70">{item.category}</p>
                  )}
                  {item.title && <p className="text-sm font-semibold text-white">{item.title}</p>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
