import ClientDocs from "@/components/client/ClientDocs";
import ClientFetch from "@/components/client/ClientFetch";
// import { SessionProvider } from "next-auth/react";
export default async function page({
    params
}: {
    params: Promise<{ clientId: string }>
}) {

    const { clientId } = await params;
    return (
        <>
            <ClientFetch clientId={clientId}  />
            <ClientDocs clientId={clientId} />

        </>
    )
}
