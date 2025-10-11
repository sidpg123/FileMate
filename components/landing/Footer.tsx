"use client";

import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";

export default function Footer() {
  return (
    <section id="contact" className="min-h-[60vh] max-w-[100vw] flex flex-col justify-between">
      <footer className="md:mx-auto md:w-3/4 md:pl-5 bg-primaryLight rounded-lg pt-5 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-lg  ">
              <span className="gradient-text">filesmate</span> - Secure Document
              Management
            </h3>
            <p className="mt-2 text-sm text-darkLight">
              filesmate helps professionals securely manage and share documents
              with clients, offering features like client-specific access,
              tracking, and notifications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg ">Quick Links</h3>
            <ul className="mt-2 text-darkLight  text-sm space-y-2">
cd 
            </ul>
          </div>

          {/* Contact & Social Links */}
          <div>
            <h3 className="text-lg ">Contact Us</h3>
            <div className="text-darkLight">
              <p className="mt-2 text-sm">📍 Kolhapur, Maharashtra, India</p>
              <p className="text-sm">📞 +91 XXXXX XXXXX</p>
              <p className="text-sm">✉️ sidpgkit@gmail.com</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <Link
                href="https://www.facebook.com"
                className="text-gray-400 hover:text-blue-500 text-xl"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="https://www.linkedin.com"
                className="text-gray-400 hover:text-blue-500 text-xl"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </Link>
              <Link
                href="https://www.twitter.com"
                className="text-gray-400 hover:text-blue-500 text-xl"
                aria-label="Twitter"
              >
                <XIcon />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} filesmate. All Rights Reserved.
        </div>
      </footer>
    </section>
  );
}
