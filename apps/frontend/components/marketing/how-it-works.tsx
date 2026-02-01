const steps = [
  {
    number: '01',
    title: 'Browse the Marketplace',
    description: 'Explore ad slots from verified publishers across multiple formats and niches.',
  },
  {
    number: '02',
    title: 'Request a Placement',
    description:
      'Found the right fit? Send a booking request with an optional message to the publisher.',
  },
  {
    number: '03',
    title: 'Launch & Track',
    description:
      'Once approved, manage your active placements and track results from your dashboard.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white/85">How it works</h2>
        <p className="mx-auto mt-4 max-w-md text-white/35">
          Get from browsing to booked in three simple steps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent p-7"
          >
            <span className="mb-4 block text-3xl font-bold tracking-tight text-white/[0.08]">
              {step.number}
            </span>
            <h3 className="mb-2 text-lg font-semibold tracking-tight text-white/80">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/35">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
