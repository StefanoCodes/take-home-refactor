import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getUserRole } from '@/lib/data-access-layer/auth/get-user-role';
import { getPublisherQuotes } from '@/lib/data-access-layer/quotes/get-publisher-quotes';
import { QuoteStatusActions } from '@/components/dashboard/publisher/quote-status-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { redirect } from 'next/navigation';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
  RESPONDED: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  ACCEPTED: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  DECLINED: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

export default async function PublisherQuotesPage() {
  const { user } = await isAuthenticated();

  if (!user) {
    return redirect('/login');
  }

  const roleData = await getUserRole(user.id);

  if (roleData.role !== 'publisher') {
    return redirect('/');
  }

  const quotes = await getPublisherQuotes();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quote Requests</h1>

      {quotes.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">No quote requests yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When sponsors request quotes for your ad slots, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Company</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Ad Slot</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {quote.companyName}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${quote.email}`}
                      className="text-blue-400/80 transition-colors hover:text-blue-300"
                    >
                      {quote.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {quote.adSlot.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[quote.status] ?? 'bg-white/5 text-muted-foreground'}`}
                    >
                      {quote.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <QuoteStatusActions quoteId={quote.id} currentStatus={quote.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
