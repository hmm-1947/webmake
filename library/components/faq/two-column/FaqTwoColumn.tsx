export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqTwoColumnProps {
  heading?: string;
  items?: FaqItem[];
}

const defaultItems: FaqItem[] = [
  { question: "How does billing work?", answer: "You're billed monthly based on your plan tier." },
  { question: "Can I cancel anytime?", answer: "Yes, cancel anytime from your account settings." },
];

export default function FaqTwoColumn({
  heading = "Frequently asked questions",
  items = defaultItems,
}: FaqTwoColumnProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>

        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.question}>
              <h3 className="font-heading text-lg font-semibold">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
