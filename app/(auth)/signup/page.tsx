
import SignUpForm from "@/components/Auth/singup";
import { auth } from "@/lib/auth";

export default async function SignUp() {
  const session = await auth(); // Get session on the server
    //console.log(session?.user);
  
    if (session?.user) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">You are already signed in.</p>
        </div>
      );
    }
  
  return <SignUpForm />;
}
