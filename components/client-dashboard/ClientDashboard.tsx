
"use client";
import { useState } from "react";
import ClientFees from "./ClientFees";
import ClientViewDocuments from "./ClientViewDocuments";
import Hero from "./Hero";

export default function ClientDashboard() {
    const [view, setView] = useState<'documents' | 'payments'>('documents');
    // const session = useSession();
    // //console.log("session data", session)

    return (
        <div>
            <Hero view={view} setView={setView}   />
            {
                view === 'documents' ? (
                    
                  <ClientViewDocuments />
                ) : (

                   <ClientFees />
                )
            }
        </div>
    );
}





