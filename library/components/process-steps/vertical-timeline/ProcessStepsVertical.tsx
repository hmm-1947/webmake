export interface ProcessStep { title: string; description?: string }
export interface ProcessStepsVerticalProps { eyebrow?: string; heading?: string; steps?: ProcessStep[] }

const defaultSteps: ProcessStep[] = [
  { title: "Discovery call", description: "We learn about your goals, constraints and timeline." },
  { title: "Proposal & plan", description: "A clear scope, milestones and pricing before anything starts." },
  { title: "Build & iterate", description: "Regular check-ins as the work takes shape." },
  { title: "Launch & support", description: "We ship it, then stay close for the first few weeks." },
];

export default function ProcessStepsVertical({ eyebrow = "How we work", heading = "A simple, transparent process", steps = defaultSteps }: ProcessStepsVerticalProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
        </div>
        <div className="relative mx-auto mt-14 max-w-2xl">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-border" aria-hidden="true" />
          <ol className="space-y-10">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-6 pl-0">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background font-heading text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-heading text-lg font-semibold">{s.title}</h3>
                  {s.description && <p className="mt-1.5 text-sm leading-6 text-foreground/65">{s.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
