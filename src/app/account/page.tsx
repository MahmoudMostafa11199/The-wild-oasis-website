import { auth } from '@/_lib/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guest area',
};

export default async function page() {
  const session = await auth();

  const firstname = session?.user?.name!.split(' ').at(0);

  return (
    <h1 className="text-2xl font-medium text-accent-500">
      Welcome, {firstname}
    </h1>
  );
}
