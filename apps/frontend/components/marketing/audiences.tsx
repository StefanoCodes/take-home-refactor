export function Audiences() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-gradient-to-b from-blue-500/[0.06] to-transparent p-8 shadow-sm dark:primary-card-shadow">
          <div className="mb-4 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium tracking-wide text-blue-600 uppercase ring-1 ring-blue-500/20 dark:text-blue-300 dark:ring-blue-400/20">
            Sponsors
          </div>
          <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
            Reach the right audience
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Create campaigns, set budgets, and place your brand in front of engaged audiences
            through premium publishers. Browse available placements by format, niche, and price.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-blue-500/60 dark:bg-blue-400/60" />
              Browse curated ad placements
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-blue-500/60 dark:bg-blue-400/60" />
              Transparent monthly pricing
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-blue-500/60 dark:bg-blue-400/60" />
              Campaign dashboard & tracking
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-b from-emerald-500/[0.06] to-transparent p-8 shadow-sm dark:primary-card-shadow">
          <div className="mb-4 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-600 uppercase ring-1 ring-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-400/20">
            Publishers
          </div>
          <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
            Monetize your audience
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            List your ad slots, set your own rates, and receive booking requests from qualified
            sponsors. Manage everything from a simple publisher dashboard.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-500/60 dark:bg-emerald-400/60" />
              List multiple ad slot formats
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-500/60 dark:bg-emerald-400/60" />
              Set your own monthly rates
            </li>
            <li className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-500/60 dark:bg-emerald-400/60" />
              Manage bookings & availability
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
