"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";

function Hero() {
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push("/signup"); // Navigate to the signup page
  };
  return (
    <section className="min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row-reverse justify-center pt-14 md:pt-32 mx-auto md:max-w-[95%]">
        <div className="w-full mx-auto max-w-[80%] flex justify-center items-center px-6 sm:w-9/12 md:w-2/4 xl:w-[40%]">
          <Image
            className="rounded-lg content-center"
            width={500}
            height={200}
            src={"/hero.png"}
            alt={"Hero image"}
          />
        </div>

        <div className="mt-5 max-w-[80%] md:max-w-[35%] p-5 mx-auto border-slate-700 w-full md:w-1/2 flex flex-col">
          <h1 className="text-sm font-bold tracking-wider bg-gradient-to-r from-[#4A72FF] via-[#5C53D1] to-[#712D99] bg-clip-text text-transparent">
            Store Smart, Access Fast!
          </h1>
          <h1 className="pt-7 text-4xl tracking-wide ">
            Say Goodbye to Endless Calls for Documents
          </h1>
          <h4 className="pt-3 tracking-wide text-slate-400">
            Effortlessly upload, manage, and share important financial documents
            with your clients – secure, accessible, and hassle-free anytime.
          </h4>
          <div className="mt-6 flex flex-row">
            <Button
              className="py-5 px-7 mr-3 bg-[#4A72FF] hover:bg-blue-500 shadow-md shadow-blue-600"
              onClick={handleRegisterClick} // Use the function to navigate
            >
              Register <ArrowCircleUpIcon className="rotate-90" />
            </Button>
            <Button className="py-5 px-7 mx-auto text-[#4A72FF] bg-[#f1f1f3] hover:bg-[#f1eeeeee] shadow-md shadow-slate-300">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      {/* <h1 className="absolute bottom-10 left-[50%] text-sm font-bold tracking-wider bg-gradient-to-r from-[#4A72FF] via-[#5C53D1] to-[#712D99] bg-clip-text text-transparent">
        Swipte Down
      </h1> */}
    </section>
  );
}

export default Hero;
