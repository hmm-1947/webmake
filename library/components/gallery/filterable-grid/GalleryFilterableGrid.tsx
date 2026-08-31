"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

export interface GalleryItem {
  imageUrl: string;
  title?: string;
  category?: string;
}

export interface GalleryFilterableGridProps {
  heading?: string;
  subheading?: string;
  items?: GalleryItem[];
}

const defaultItems: GalleryItem[] = [
  { imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", title: "Project One", category: "Branding" },
  { imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80", title: "Project Two", category: "Web" },
  { imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", title: "Project Three", category: "Product" },
  { imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", title: "Project Four", category: "Branding" },
  { imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80", title: "Project Five", category: "Web" },
  { imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", title: "Project Six", category: "Product" },
];

export default function GalleryFilterableGrid({
  heading = "Selected work",
  subheading,
  items = defaultItems,
}: GalleryFilterableGridProps) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => item.category && set.add(item.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const filtered = filter === "All" ? items : items.filter((item) => item.category === filter);

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-foreground/70">{subheading}</p>}
        </div>

        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  filter === cat
                    ? "border-accent bg-accent text-white"
                    : "border-border text-foreground/70 hover:border-accent/50 hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <motion.div layout className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.button
                key={item.imageUrl}
                type="button"
                layout
                onClick={() => setActive(item)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border text-left"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? "Portfolio image"}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                {(item.title || item.category) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                    {item.category && (
                      <p className="text-xs font-medium uppercase tracking-wide text-white/70">{item.category}</p>
                    )}
                    {item.title && <p className="text-sm font-semibold text-white">{item.title}</p>}
                  </div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
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
              className="relative aspect-square w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.imageUrl}
                alt={active.title ?? "Portfolio image"}
                fill
                sizes="672px"
                className="rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
