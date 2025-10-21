// pages/privacy.tsx
import Head from "next/head";
import React from "react";

export default function PrivacyPolicy() {
  const year = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>Privacy Policy — FileMate</title>
        <meta
          name="description"
          content="Privacy Policy for FileMate — how we collect, use and protect your information."
        />
      </Head>

      <main className="min-h-screen bg-white text-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">
            <strong>Last updated:</strong> {`October ${year}`}
          </p>

          <section className="mb-6">
            <p>
              Welcome to <strong>FileMate</strong>, operated by{" "}
        <strong>PATIL SIDDHARTH BALASAHEB</strong>, (“we”, “our”, “us”). This
              Privacy Policy explains how we collect, use, and protect your
              personal information when you use our website and services. By
              accessing or using FileMate, you agree to the practices described
              in this policy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Name and contact information (email, phone — if provided)</li>
              <li>Account and login details</li>
              <li>Files or documents you upload to your account</li>
              <li>Usage data such as IP address, browser type, and device info</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. How We Use the Information</h2>
            <p className="mb-2">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Communicate with you about updates, security alerts, or support</li>
              <li>Process transactions and payments securely via Razorpay</li>
              <li>Prevent unauthorized access or fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> sell, trade, or rent users’ personal information to third parties.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
            <p>
              We are committed to protecting your information. We implement
              appropriate technical and organizational measures such as
              encryption, access controls, and secure server storage. However,
              no method of transmission over the Internet or electronic storage
              is 100% secure — absolute security cannot be guaranteed.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
            <p className="mb-2">
              We use cookies to enhance your experience and analyze site traffic.
              Cookies help us understand which pages are useful and improve our
              services. You may choose to accept or decline cookies via your
              browser settings; declining cookies may affect site functionality.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Sharing of Information</h2>
            <p className="mb-2">
              We may share your information only in these circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>With Razorpay for secure payment processing</li>
              <li>With trusted third-party service providers (hosting, analytics) who must keep data confidential</li>
              <li>If required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
            <p className="mb-2">
              You may request to access, update, or delete your personal
              information, or withdraw consent for promotional communications.
              To exercise these rights, contact us using the details below.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with a revised date. Please review
              periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
            <p>
              If you have questions or want to exercise your data-rights,
              please contact:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> <a href="mailto:filesmate.in@gmail.com" className="text-blue-600 hover:underline">filesmate.in@gmail.com</a>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              This policy applies to the use of the FileMate platform. FileMate is an independent digital service based in Kolhapur, Maharashtra, India.
            </p>
          </section>

          <footer className="pt-6 border-t">
            <p className="text-sm text-gray-600">© {year} FileMate. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </>
  );
}
