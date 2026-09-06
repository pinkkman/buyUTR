import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import VerifyIdClient from './client';

export default async function VerifyIdPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return <VerifyIdClient />;
}