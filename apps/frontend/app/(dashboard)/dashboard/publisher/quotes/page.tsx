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
  PENDING: 'bg-yellow-500/10 text-yellow-400',
  RESPONDED: 'bg-blue-500/10 text-blue-400',
  ACCEPTED: 'bg-emerald-500/10 text-emerald-400',
  DECLINED: 'bg-red-500/10 text-red-400',
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
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-white/40">No quote requests yet.</p>
          <p className="mt-1 text-sm text-white/25">
            When sponsors request quotes for your ad slots, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="text-white/30">Company</TableHead>
                <TableHead className="text-white/30">Email</TableHead>
                <TableHead className="text-white/30">Ad Slot</TableHead>
                <TableHead className="text-white/30">Status</TableHead>
                <TableHead className="text-white/30">Date</TableHead>
                <TableHead className="text-white/30">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id} className="border-white/[0.04]">
                  <TableCell className="font-medium text-white/80">
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
                  <TableCell className="text-white/60">
                    {quote.adSlot.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[quote.status] ?? 'bg-white/5 text-white/40'}`}
                    >
                      {quote.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/40">
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
