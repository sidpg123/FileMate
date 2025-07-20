import Info from '@/components/dashboard/Info';
import ListClient from '@/components/dashboard/ListClient';
import { auth } from '@/lib/auth';
// import { SessionProvider } from 'next-auth/react';

export default async function User() {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You need to be logged in to access this page.</p>
      </div>
    );
  }

  return (
    // <SessionProvider session={session}>
    <>
      <Info />
      <ListClient />
    </>
    // </SessionProvider>
  )
}

