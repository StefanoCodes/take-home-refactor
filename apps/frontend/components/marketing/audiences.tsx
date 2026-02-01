export function Audiences() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-blue-500/[0.06] to-transparent p-8 primary-card-shadow">
          <div className="mb-4 inline-flex rounded-full bg-blue-400/10 px-3 py-1 text-xs font-medium tracking-wide text-blue-300 uppercase ring-1 ring-blue-400/20">
            Sponsors
          </div>
          <h3 className="mb-3 text-xl font-semibold tracking-tight text-white/85">
            Reach the right audience
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-white/35">
            Create campaigns, set budgets, and place your brand in front of engaged audiences
            through premium publishers. Browse available placements by format, niche, and price.
          </p>
          <ul className="space-y-3 text-sm text-white/45">
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-blue-400/60" />
              Browse curated ad placements
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-blue-400/60" />
              Transparent monthly pricing
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-blue-400/60" />
              Campaign dashboard & tracking
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-emerald-500/[0.06] to-transparent p-8 primary-card-shadow">
          <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-300 uppercase ring-1 ring-emerald-400/20">
            Publishers
          </div>
          <h3 className="mb-3 text-xl font-semibold tracking-tight text-white/85">
            Monetize your audience
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-white/35">
            List your ad slots, set your own rates, and receive booking requests from qualified
            sponsors. Manage everything from a simple publisher dashboard.
          </p>
          <ul className="space-y-3 text-sm text-white/45">
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-400/60" />
              List multiple ad slot formats
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-400/60" />
              Set your own monthly rates
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-400/60" />
              Manage bookings & availability
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
