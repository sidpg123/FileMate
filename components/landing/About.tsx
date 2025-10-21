import React from "react";
import { SecurityComponent } from "./Security";
import PendingFeeTracking from "./Feestracking";

const docsImages = [
  "/images/aadhar.jpg",
  "/images/pan.png",
  "/images/itr.png",
  "/images/form.png",
  "/images/gst.jpg",
];

const peopleImages = [
  "/images/people/p1.jpg",
  "/images/people/p2.jpg",
  "/images/people/p3.jpg",
  "/images/people/p4.jpg",
  "/images/people/p5.jpg",
];

export default function About() {
  return (
    <section id="about" className="min-h-screen ">
      <div className="text-center">
        <h1 className="mt-16 md:mt-0 text-sm">
          Filesmate – Your trusted file management companion.
        </h1>
        <h1 className="text-2xl tracking-wider p-3">
          Tired of clients calling for documents?
        </h1>
        <h1 className="text-sm mx-4 text-slate-500">
          Store, share, and manage them securely – anytime, anywhere.
        </h1>
      </div>


      <div className="flex flex-col md:flex-row justify-between items-center mx-auto w-[78%]">

        <div className="w-80">
          <SecurityComponent
            centerImage={"/images/aws.png"}
            roundImages={docsImages}
          />
          <h1 className="text-center pb-2 tracking-wide text-lg">
            Secure Document Storage
          </h1>
          <h1 className="text-center text-darkLight pl-4 ">
            Store and organize important financial documents like ITR copies,
            PAN cards, and balance sheets in a highly secure cloud environment,
            ensuring only authorized clients can access them anytime.
          </h1>
        </div>


        <div className="w-80">
          <SecurityComponent
            centerImage="/images/lock.png"
            roundImages={peopleImages}
            keyImages={[0, 3]}
          />
          <h1 className="text-center pb-2 tracking-wide text-lg">
            Client-Specific File Access
          </h1>
          <h1 className="text-center text-darkLight pl-4 ">
            Each client gets personalized access to their own documents,
            eliminating the need for constant calls and manual file sharing.
            Admins can easily upload, manage, and update documents for
            individual clients.
          </h1>
        </div>


        <div className="w-80">
          <PendingFeeTracking />
          <h1 className="text-center pb-2 tracking-wide text-lg">
            Pending Fee Tracking
          </h1>
          <h1 className="text-center text-darkLight pl-4 ">
            Track pending payments from clients with a simple dashboard. Mark
            payments as received and send automated reminders to ensure smooth
            financial transactions without any manual follow-ups.
          </h1>
        </div>


      </div>
    </section>
  );
}
