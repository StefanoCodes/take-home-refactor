const features = [
  {
    title: 'Curated Placements',
    description:
      'Browse a vetted marketplace of premium ad slots across newsletters, podcasts, display, and video.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Curated Placements</title>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: 'Transparent Pricing',
    description:
      'Every listing shows clear monthly rates. No hidden fees, no bidding wars — just straightforward sponsorship deals.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Transparent Pricing</title>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Campaign Management',
    description:
      'Track your active placements, manage budgets, and monitor performance from a single dashboard.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Campaign Management</title>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 5 5-9" />
      </svg>
    ),
  },
  {
    title: 'Publisher Tools',
    description:
      'List your inventory, set your own rates, and receive booking requests directly from qualified sponsors.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Publisher Tools</title>
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838.838-2.872a2 2 0 0 1 .506-.855z" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white/85">
          Everything you need to run sponsorships
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/35">
          Whether you&apos;re a sponsor looking for reach or a publisher monetizing your audience.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 primary-card-shadow transition-all duration-200 hover:border-white/[0.12] hover:from-white/[0.08] hover:to-white/[0.03]"
          >
            <div className="mb-4 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 text-white/50 transition-colors group-hover:text-white/70">
              {feature.icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-tight text-white/85">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/35">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
