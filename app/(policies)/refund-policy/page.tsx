// pages/refund-policy.tsx
// import Head from "next/head";
import React from "react";

export default function RefundPolicy() {
  const year = new Date().getFullYear();

  return (
    <>
      <main className="min-h-screen bg-white text-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            <strong>Last updated:</strong> {`October ${year}`}
          </p>

          <section className="mb-6 space-y-4">
            <p>
              <strong>FileMate</strong> (operated by Patil Siddharth Balasaheb)
              believes in helping its customers as far as possible and follows a
              fair and transparent cancellation and refund policy.
            </p>

            <h2 className="text-xl font-semibold">1. Order Cancellations</h2>
            <p>
              Cancellation requests will be accepted only if made within{" "}
              <strong>1–2 days</strong> of placing the order. However, if the
              order has already been processed, shipped, or shared with the
              concerned vendor, the cancellation request may not be accepted.
            </p>

            <p>
              Orders for perishable or time-sensitive items (such as eatables,
              flowers, etc.) cannot be cancelled once processing has begun.
              However, in such cases, refunds may be considered if the customer
              establishes that the quality of the product or service delivered
              was unsatisfactory.
            </p>

            <h2 className="text-xl font-semibold mt-6">
              2. Damaged or Defective Items
            </h2>
            <p>
              If you receive damaged or defective items, please report the issue
              to our support team within <strong>1–2 days</strong> of receiving
              the product. The merchant will verify and approve replacement or
              refund requests as appropriate.
            </p>

            <h2 className="text-xl font-semibold mt-6">
              3. Product Mismatch or Quality Concerns
            </h2>
            <p>
              If the product received is not as described on our website or does
              not meet your expectations, contact our support team within{" "}
              <strong>1–2 days</strong> of delivery. After reviewing your
              concern, we’ll take an appropriate decision on refund or
              replacement.
            </p>

            <h2 className="text-xl font-semibold mt-6">
              4. Manufacturer Warranty
            </h2>
            <p>
              For products covered under a manufacturer’s warranty, please refer
              the issue directly to the respective manufacturer or service
              provider for resolution.
            </p>

            <h2 className="text-xl font-semibold mt-6">5. Refund Timeline</h2>
            <p>
              Once approved, refunds are typically processed within{" "}
              <strong>3–5 business days</strong> to the original payment method.
              The time it takes for the refunded amount to appear in your
              account depends on your payment provider.
            </p>

            <h2 className="text-xl font-semibold mt-6">6. Contact Us</h2>
            <p>
              For any questions, cancellation, or refund requests, please reach
              out to our support team at:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:filesmate.in@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  filesmate.in@gmail.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong> 8087248298
              </li>
              <li>
                <strong>Location:</strong> Kolhapur, Maharashtra, India
              </li>
            </ul>
          </section>

          <footer className="pt-6 border-t">
            <p className="text-sm text-gray-600">
              © {year} FileMate. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
