import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ListingForm from '@/components/marketplace/listing-form';

export default async function NewListingPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sell an Item</h1>
      <ListingForm />
    </div>
  );
}