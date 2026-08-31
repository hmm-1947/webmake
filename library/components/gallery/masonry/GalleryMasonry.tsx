"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

export interface GalleryItem {
  imageUrl: string;
  title?: string;
  category?: string;
}

export interface GalleryMasonryProps {
  heading?: string;
  subheading?: string;
  items?: GalleryItem[];
}

const defaultItems: GalleryItem[] = [
  { imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", title: "Project One", category: "Branding" },
  { imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80", title: "Project Two", category: "Web" },
  { imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", title: "Project Three", category: "Product" },
];

export default function GalleryMasonry({
  heading = "Selected work",
  subheading,
  items = defaultItems,
}: GalleryMasonryProps) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        <div className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, i) => (
            <motion.button
              key={item.imageUrl + i}
              type="button"
              onClick={() => setActive(item)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              className="group relative mb-4 block w-full overflow-hidden rounded-lg border border-border text-left"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? "Portfolio image"}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              {(item.title || item.category) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  {item.category && (
                    <p className="text-xs font-medium uppercase tracking-wide text-white/70">{item.category}</p>
                  )}
                  {item.title && <p className="text-sm font-semibold text-white">{item.title}</p>}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute right-6 top-6 text-white/80 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative aspect-[4/3] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.imageUrl}
                alt={active.title ?? "Portfolio image"}
                fill
                sizes="768px"
                className="rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
