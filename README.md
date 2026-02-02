<div align="left" style="margin-bottom: 2rem;">
  <img src="https://anvara-production.nyc3.cdn.digitaloceanspaces.com/anvarabluetext.png" alt="Anvara" width="500" />
</div>

## Architecture & Design Decisions

### Single Source of Truth: The `@anvara/schemas` Package

The most critical architectural decision in this project is the `packages/schemas` package. It holds every Zod schema that defines the shape of data flowing through the system -- inputs (DTOs), outputs (response objects), query parameters, and shared enums. Both the Express backend and the Next.js frontend import from this single package.

```
packages/schemas/src/
  common.ts            # Shared enums (CampaignStatus, AdSlotType, ...) + errorResponseSchema / successResponseSchema
  auth/
    get-me.ts          # getMeOutputSchema
    get-role.ts        # getUserRoleOutputSchema
  ad-slots/
    book-ad-slot.ts    # bookAdSlotInputSchema + bookAdSlotOutputSchema
    list-ad-slots.ts   # listAdSlotsQuerySchema + listAdSlotsOutputSchema
    ...
  campaigns/
  sponsors/
  placements/
  dashboard/
  health/
```

Types are **inferred** from Zod schemas, never hand-written:

```ts
// packages/schemas/src/common.ts
export const campaignStatusSchema = z.enum(['DRAFT', 'PENDING_REVIEW', 'APPROVED', ...]);
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;
```

This eliminates type drift entirely. If an API response shape changes, you update the schema in one place and both the backend and frontend get type errors immediately. The Zod schemas also double as runtime validators -- the backend uses them in `validateBody()` middleware, the frontend uses them in the API client and in form validation via `zodResolver`.

---

### Type-Safe API Client (`lib/api-client.ts`)

The frontend uses `@better-fetch/fetch` configured with `createSchema()` to map every endpoint to its corresponding `@anvara/schemas` validators:

```ts
// apps/frontend/lib/api-client.ts
export const $fetch = createFetch({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  schema: createSchema({
    '@get/api/campaigns': {
      query: listCampaignsQuerySchema, // from @anvara/schemas
      output: listCampaignsOutputSchema, // from @anvara/schemas
    },
    '@post/api/ad-slots/:id/book': {
      input: bookAdSlotInputSchema, // from @anvara/schemas
      output: bookAdSlotOutputSchema, // from @anvara/schemas
    },
    // ... every endpoint mapped
  }),
});
```

Every `$fetch` call is fully typed end-to-end. Writing `$fetch("@get/api/campaigns")` returns `{ data: ListCampaignsOutput | null, error: ErrorResponse | null }` -- autocomplete, type checking, and in development mode, **runtime validation** of the response body against the Zod schema. If the backend returns an unexpected shape, you get an immediate error instead of a silent data mismatch propagating through the UI.

---

### Data Access Layer (`lib/data-access-layer/`)

Instead of calling `$fetch` directly from page components, all data fetching goes through a **data access layer**. Every function in this layer does two things: checks authentication first via `isAuthenticated()`, then fetches data.

```ts
// apps/frontend/lib/data-access-layer/auth/get-user.ts
import 'server-only';
import { $fetch } from '@/lib/api-client';
import type { GetMeOutput } from '@anvara/schemas';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { redirect } from 'next/navigation';

export async function getUser(): Promise<GetMeOutput | null> {
  const { isLoggedIn } = await isAuthenticated();
  if (!isLoggedIn) redirect('/login');

  const { data, error } = await $fetch('@get/api/auth/me');
  if (error) return null;
  return data;
}
```

Every data access function follows this same pattern -- `getCampaigns()`, `getAdSlots()`, `getUserRole()` all call `isAuthenticated()` before touching the API:

```ts
// apps/frontend/lib/data-access-layer/campaigns/get-campaigns.ts
export async function getCampaigns(sponsorId: string): Promise<ListCampaignsOutput | null> {
  const { isLoggedIn } = await isAuthenticated();
  if (!isLoggedIn) redirect('/login');

  const { data, error } = await $fetch('@get/api/campaigns', { query: { sponsorId } });
  if (error) return null;
  return data;
}
```

The `"server-only"` import guarantees these functions can never be bundled into client code -- attempting to import them from a `"use client"` component is a build-time error.

This matters because it **decouples auth from page components**. The authentication boundary lives at the data access layer, not at the page level. Consider what happens without this pattern:

```tsx
// Without data access layer -- auth is the page's responsibility
export default async function SomePage() {
  const session = await isAuthenticated(); // easy to forget on a new page
  const campaigns = await $fetch('@get/api/campaigns', { query: { sponsorId } });
}
```

If a developer creates a new page and forgets the auth check, data is exposed. With the data access layer, auth is **built into every data access function**. The page component never needs to think about it -- it calls `getCampaigns(sponsorId)` and the auth check is guaranteed to run. Even if `getCampaigns` is used from a component that has no auth guard at the top, the function itself redirects unauthenticated users before any data is fetched.

---

### Optimistic Redirect vs. Security: `proxy.ts` and `getSessionCookie`

Navigation should stay fast. Calling `auth.api.getSession({ headers })` on every request hits the database (via Better Auth) and can slow down every page load. The frontend therefore splits **optimistic redirection** from **actual security checks**.

**`proxy.ts` (middleware)** uses `getSessionCookie(request)` from `better-auth/cookies` instead of `auth.api.getSession`. Reading the cookie is synchronous and does not touch the database. The proxy only decides: if there is no session cookie and the route is protected, redirect to `/login` immediately. This is an **optimistic redirect** — we assume no cookie means not logged in and send the user to login without waiting for a DB round-trip. It improves perceived performance and keeps navigation snappy.

**Security is not enforced in the proxy.** It is enforced in two places:

1. **Page level** — Dashboard pages (e.g. `dashboard/sponsor/page.tsx`, `dashboard/publisher/page.tsx`) call `isAuthenticated()` (which uses `auth.api.getSession` and the DB). If there is no user, they `redirect('/login')`. This is the first real auth boundary.
2. **Data access layer** — Every data access function (`getUser()`, `getCampaigns()`, `getAdSlots()`, etc.) calls `isAuthenticated()` and redirects if `!isLoggedIn` before fetching any data. So even if a page forgot to check auth, the data layer would still redirect unauthenticated users.

So: **proxy = cookie-only, fast redirect.** **Page + data access = full session check (DB).** The proxy is for UX (quick redirect); the page and data access layer are for security.

---

### Render-Pass Memoization with `React.cache`

This is where the data access layer pattern and `React.cache` work together. Every data access function calls `isAuthenticated()`, and `isAuthenticated` is wrapped in `cache()`:

```ts
// apps/frontend/lib/auth-helpers.server.ts
import { cache } from 'react';

export const isAuthenticated = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return {
    isLoggedIn: !!session,
    session: session?.session,
    user: session?.user,
  };
});
```

`cache()` from React is a **render-pass memoization** primitive -- not a persistent cache, not a browser cache. It memoizes the result of a function for the duration of a single server render. The first call executes the function and stores the result; every subsequent call with the same arguments in that render pass returns the stored result immediately without re-executing.

This is critical because of how the data access layer works. Consider a typical page render:

```tsx
export default async function SponsorDashboard() {
  const user = await getUser(); // calls isAuthenticated() internally
  const role = await getUserRole(user.id); // calls isAuthenticated() internally
  const campaigns = await getCampaigns(sponsorId); // calls isAuthenticated() internally
}
```

Without `cache()`, this page would verify the session **three times** -- three separate database round-trips to Better Auth, all returning the same result. With `cache()`, the first `isAuthenticated()` call (inside `getUser()`) hits the database and resolves the session. The next two calls (inside `getUserRole()` and `getCampaigns()`) skip the database entirely and reuse the memoized result instantly.

The same applies across component boundaries. If the navbar component calls `isAuthenticated()` and the page component calls `getUser()` (which calls `isAuthenticated()` internally), only one session lookup happens for the entire render tree. One verification per request, no matter how many components or data access functions need auth context.

---

### Type-Safe & Auth-Safe Server Actions (`lib/action-client.ts`)

Server actions use `next-safe-action` to compose middleware chains with two client tiers:

**Base client** -- structured logging middleware on every action:

```ts
export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({ actionName: z.string(), actionDescription: z.string() });
  },
}).use(async ({ next, clientInput, metadata }) => {
  Logger.info('Action middleware started', { actionName: metadata.actionName });
  const startTime = performance.now();
  const result = await next();
  Logger.info('Action completed', {
    result,
    clientInput,
    metadata,
    executionTime: `${performance.now() - startTime}ms`,
  });
  return result;
});
```

Every action gets automatic structured logging with execution time, input payload, and metadata -- useful for debugging and auditing.

**Protected client** -- adds authentication on top:

```ts
export const authActionClient = actionClient.use(async ({ next }) => {
  const { isLoggedIn, session, user } = await isAuthenticated();
  if (!isLoggedIn) throw new Error('Unauthorized');
  return next({ ctx: { user, session } });
});
```

Any action built with `authActionClient` is guaranteed to have a valid session. The user and session are passed through `ctx`, so the action body never needs to fetch them separately.

**In practice** -- a protected, validated action:

```ts
// apps/frontend/lib/server-actions/ad-slots/book-ad-slot.ts
export const bookAdSlotAction = authActionClient
  .metadata({ actionName: 'bookAdSlot', actionDescription: 'Book an ad slot placement' })
  .inputSchema(bookAdSlotSchema) // Zod validation before the action body runs
  .action(async ({ parsedInput }) => {
    const { adSlotId, sponsorId, message } = parsedInput;
    const { data, error } = await $fetch('@post/api/ad-slots/:id/book', {
      params: { id: adSlotId },
      body: { sponsorId, message },
    });
    if (error) throw new ActionError(error.error ?? 'Failed to book placement');
    return { success: true, message: data.message };
  });
```

The chain is: logging middleware -> auth middleware -> Zod input validation -> action body. If any step fails, the action short-circuits with a typed error.

---

### Multi-Layer Validation: Client -> Server Action -> Express Backend

This is the full validation chain for a mutation like booking an ad slot:

**Layer 1 -- Client-side (React Hook Form + Zod):**

```tsx
// apps/frontend/components/dashboard/marketplace/marketplace-listing/book-ad-slot-form.tsx
import { bookAdSlotInputSchema } from '@anvara/schemas';

export const bookAdSlotSchema = bookAdSlotInputSchema.extend({
  adSlotId: z.string().min(1),
});

const form = useForm<BookAdSlotSchemaType>({
  resolver: zodResolver(bookAdSlotSchema),
  defaultValues: { adSlotId, sponsorId, message: '' },
});
```

The form schema **extends** the shared `bookAdSlotInputSchema` from `@anvara/schemas` with client-specific fields (`adSlotId`). `zodResolver` validates input before the form submits -- invalid data never leaves the browser. React Hook Form uses uncontrolled inputs by default, so only the fields that change re-render, avoiding the performance cost of re-rendering the entire form on every keystroke.

**Layer 2 -- Server action (next-safe-action + Zod):**

```ts
.inputSchema(bookAdSlotSchema) // parsed and validated server-side before .action() runs
```

Even if someone bypasses the client form and calls the server action directly, `next-safe-action` runs `bookAdSlotSchema.safeParse()` on the input. Invalid data never reaches the action body.

**Layer 3 -- Express backend (validateBody middleware + Zod):**

```ts
// apps/backend/src/middleware/validate.ts
export function validateBody(schema: ZodSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) { sendError(res, 400, "Validation failed"); return; }
    req.body = result.data;  // replaces raw body with parsed + stripped data
    next();
  };
}

// apps/backend/src/routes/adSlots.ts
router.post("/:id/book", validateBody(bookAdSlotInputSchema), async (req, res) => { ... });
```

The Express backend validates with the **exact same `bookAdSlotInputSchema`** from `@anvara/schemas`. Even if an attacker sends a raw HTTP request bypassing both the form and the server action, the Express middleware rejects malformed input. There is no possibility of validation rule drift between layers -- all three share the same Zod schema from the same package.

---

### React Components and Composition

The frontend avoids prop drilling and keeps components focused by using **small, composable building blocks** and **compound components**. Structure is expressed by composing children instead of passing many props through intermediate layers.

**Compound components** — Cards are built from primitives that each own a slice of layout and styling. For example, the marketplace ad slot card is not one big `<AdSlotCard>` that accepts a dozen props. It is a set of pieces that you compose:

```tsx
// apps/frontend/components/dashboard/marketplace/ad-slot-card.tsx
export function AdSlotCardRoot({ children, className, ...props }) { ... }
export function AdSlotCardHeader({ children, className, ...props }) { ... }
export function AdSlotCardTypeBadge({ type, className, ...props }) { ... }
export function AdSlotCardFooter({ children, className, ...props }) { ... }
```

The grid then composes these pieces and passes only the data each piece needs. No need to thread `slot`, `onClick`, or layout flags through multiple levels:

```tsx
// apps/frontend/components/dashboard/marketplace/ad-slot-grid.tsx
<AdSlotCardRoot>
  <AdSlotCardHeader>
    <h3>{slot.name}</h3>
    <AdSlotCardTypeBadge type={slot.type} />
  </AdSlotCardHeader>
  {slot.description && <p>{slot.description}</p>}
  <AdSlotCardFooter>
    <span>{slot.isAvailable ? 'Available' : 'Booked'}</span>
    <span>${slot.basePrice}/mo</span>
  </AdSlotCardFooter>
</AdSlotCardRoot>
```

**Reuse without prop drilling** — The same primitives are reused in different contexts. The publisher dashboard uses `AdSlotCardRoot`, `AdSlotCardHeader`, `AdSlotCardTypeBadge`, and `AdSlotCardFooter` inside `AdSlotCardWithActions`, which adds edit/delete buttons and dialogs. The card building blocks stay dumb and presentational; the “with actions” wrapper owns client state and callbacks. No need to pass action handlers or modal state down through a generic card component.

The sponsor dashboard follows the same pattern: `CampaignCardRoot`, `CampaignCardHeader`, `CampaignCardTitle`, `CampaignCardStatusBadge`, `CampaignCardDescription`, `CampaignCardBudget`, `CampaignCardDateRange` are composed in both read-only views and in `CampaignCardWithActions`. Each primitive receives only the props it needs (e.g. `status`, `spent`, `budget`), and the parent arranges them. That keeps components small, testable, and easy to change without touching unrelated code.

---

## Challenges Completed

### Core Challenges

| #   | Challenge                                                                                                                                                                                                                                                                                                       | Difficulty | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| 1   | **Fix TypeScript Errors** — Replaced `any` types with proper types, removed unused variables, fixed schema mismatches. `pnpm typecheck` passes cleanly.                                                                                                                                                         | Easy       | Done   |
| 2   | **Server-Side Data Fetching** — Converted client-side `useEffect` fetching to Next.js Server Components. Data is fetched on the server via the data access layer and passed as props.                                                                                                                           | Medium     | Done   |
| 3   | **Secure API Endpoints** — Implemented Express authentication middleware that validates Better Auth sessions. Returns `401` for unauthenticated requests and `403` when users try to access other users' data. User-scoped data access across all campaign and ad slot routes.                                  | Hard       | Done   |
| 4   | **CRUD Operations** — Completed all missing API endpoints: `PUT /api/campaigns/:id`, `DELETE /api/campaigns/:id`, `POST /api/ad-slots`, `PUT /api/ad-slots/:id`, `DELETE /api/ad-slots/:id`, plus `PUT /api/sponsors/:id`. All endpoints validate input, verify ownership, and return proper HTTP status codes. | Medium     | Done   |
| 5   | **Dashboards with Server Actions** — Built fully functional publisher and sponsor dashboards. All mutations (create, edit, delete) use Server Actions with `next-safe-action`. Forms use `useFormStatus` for pending states, `revalidatePath` for cache invalidation, and Zod validation at every layer.        | Hard       | Done   |

### Bonus Challenges

**Business:**

- **Improve Marketplace Conversions** — The marketplace has server-side pagination with bookmarkable URLs, type filtering, availability filtering, and a detail page with clear CTAs to book or request a quote.
- **Newsletter Signup** — Full implementation with a public newsletter signup form on the landing page, backend route with upsert to handle duplicates, and Zod validation via the shared schemas package.
- **Request Quote Feature** — Sponsors can request custom quotes for ad slots. Publishers can view incoming quote requests and update their status (PENDING, RESPONDED, ACCEPTED, DECLINED). Full backend routes, schemas, server actions, and UI.

**Design:**

- **Marketing Landing Page** — Built a full landing page with hero, features grid, how-it-works steps, audience sections, newsletter signup, and final CTA.
- **Dashboard UI/UX Improvements** — Compound component architecture for cards, consistent layout, Sonner toast notifications for action feedback, and clear visual hierarchy.
- **Animations & Polish** — Motion library for page transitions and micro-interactions. Loading spinners positioned on the right side of buttons during pending actions. Fixed CLS (Cumulative Layout Shift) on the navbar, logo, and modals.
- **Mobile Experience** — Responsive grid layouts across the marketplace, publisher dashboard, and sponsor dashboard. Responsive marketing page sections.
- **Error & Empty States** — Skeleton loading states for the marketplace grid, campaign grid, and ad slot grid. Error handling with user-facing messages via toast notifications.
- **Add Pagination** — Server-side pagination on the marketplace with search params to persist state and make URLs bookmarkable. Backend support for limit/offset pagination.

---

## Reviewer Tip

It is nice to run the frontend and backend in two split terminals side by side. The frontend logs server action invocations with structured metadata (action name, execution time, input payload) via the `next-safe-action` logging middleware, and the backend logs incoming requests with route and status information. Having both visible at the same time makes it easy to trace a user action from the browser through the server action to the API endpoint and back. This setup gives a good developer experience and makes debugging straightforward — you can see exactly what is happening at each layer as you click through the app.
