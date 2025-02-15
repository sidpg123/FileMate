import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FAQ() {
  return (
    <section className="min-h-screen">
      <div className="text-center pt-14">
        <h1 className="text-sm tracking-widest">MANY PEOPLE ASK</h1>
        <h1 className="text-2xl tracking-wider p-3">
          Frequently Asked Questions
        </h1>
        <h1 className="text-sm mx-4 text-slate-500">
          Actually, no one asked these questions, but I&apos;ll just put them
          here, who knows,
          <br /> you might want to read them, right?
        </h1>
      </div>

      <div className="flex justify-center mt-16 mb-10 md:mb-0">
        <Accordion type="single" collapsible className="mx-5 w-full md:w-1/2">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Is my data secure on this platform?
            </AccordionTrigger>
            <AccordionContent>
              Yes, your data is highly secure. We use AWS S3 for storage with
              industry-standard encryption and access controls. Only authorized
              users can access their assigned documents. Additionally, we
              implement role-based access control (RBAC) and multi-factor
              authentication (MFA) for added security.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              How can my clients access their documents?
            </AccordionTrigger>
            <AccordionContent>
              Once a CA uploads a document, the client can log in to their
              account and view/download their assigned files. Each client only
              sees their own documents, ensuring privacy and security. Clients
              will also receive a notification when a new document is uploaded,
              either via email or an in-app alert.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can I track which clients have downloaded their documents?
            </AccordionTrigger>
            <AccordionContent>
              Yes, the platform provides download tracking for each document.
              You can see which clients have accessed or downloaded their
              documents, along with the timestamp of the last download. This
              helps ensure transparency and accountability.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Is there a limit to the number of documents I can upload?
            </AccordionTrigger>
            <AccordionContent>
              There is no hard limit on the number of documents you can upload.
              However, depending on your subscription plan, there may be storage
              limits. If you require more storage, you can upgrade your plan
              accordingly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              Can I manage multiple clients from a single dashboard?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely! The platform offers a centralized dashboard where you
              can manage all your clients, upload documents and track document
              access. You can easily search, filter, and organize client records
              for a seamless experience.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              What happens if a client forgets their password?
            </AccordionTrigger>
            <AccordionContent>
              Clients can reset their password using the &quot;Forgot
              Password&quot; option on the login page. A password reset link
              will be sent to their registered email, allowing them to set a new
              password. For added security, password reset links expire after a
              short duration.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>
              Does this platform support mobile access?
            </AccordionTrigger>
            <AccordionContent>
              Yes, the platform is fully mobile-friendly. Clients and CAs can
              access their accounts via a responsive web app or the upcoming
              mobile app (Android & iOS). This ensures seamless document access
              and management from any device, anytime.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ;
