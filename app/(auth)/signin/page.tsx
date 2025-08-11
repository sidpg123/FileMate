import SignInForm from "@/components/Auth/signin";
import { auth } from "@/lib/auth";

async function SignIn() {
  const session = await auth(); // Get session on the server
  //console.log(session?.user);

  if (session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">You are already signed in.</p>
      </div>
    );
  }

  return <SignInForm />;
}

export default SignIn;
