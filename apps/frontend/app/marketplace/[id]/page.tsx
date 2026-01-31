import { AdSlotDetail } from '../../../components/marketing/marketplace/marketplace-listing/ad-slot-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdSlotPage({ params }: Props) {
  const { id } = await params;

  return <AdSlotDetail id={id} />;
}
