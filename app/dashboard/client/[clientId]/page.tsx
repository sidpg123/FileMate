"use client";

import { useEffect, useState } from "react";
import ClientDocs from "@/components/client/ClientDocs";
import ClientFetch from "@/components/client/ClientFetch";

export default function page({
    params
}: {
    params: Promise<{ clientId: string }>
}) {
    const [view, setView] = useState<'documents' | 'payments'>('documents');
    
    const [clientId, setClientId] = useState<string>('');
    
    // Handle the async params
    useEffect(() => {
        params.then(({ clientId }) => {
            setClientId(clientId);
        });
    }, [params]);

    if (!clientId) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ClientFetch 
                clientId={clientId} 
                view={view}
                setView={setView}
            />
            <ClientDocs 
                clientId={clientId} 
                view={view}
            />
        </>
    );
}