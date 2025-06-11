
import { auth } from '@/lib/auth';
import Demo from './demo';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/UserNav';
import Info from '@/components/dashboard/Info';

export default async function User() {
  const session = await auth();
  console.log("session in page", session);
  if (!session) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You need to be logged in to access this page.</p>
      </div>
    );
  }
  return (
    <SessionProvider>
      <Navbar />
      {/* <Demo /> */}
      <Info />
    </SessionProvider>

  )
}

