import ClientFetch from "@/components/client/ClientFetch";
import { auth } from "@/lib/auth";
// import { SessionProvider } from "next-auth/react";
export default async function page({
    params
}: {
    params: Promise<{ clientId: string }>
}) {
    const session = await auth();
    
    const accessToken = session?.accessToken || "";
    const { clientId } = await params;
    return (
        // <SessionProvider session={session}>
            <ClientFetch clientId={clientId}  />
            // <ClientFetch clientId={clientId} accessToken={accessToken} />
        // </SessionProvider>
    )
}
