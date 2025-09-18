"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signInSchema } from "@/zodSchem/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function SignInForm() {
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Handle URL error parameters (from NextAuth redirects)
    useEffect(() => {
        const error = searchParams.get('error');
        const message = searchParams.get('message');
        console.log("URL error:", error);
        console.log("URL message:", message);
        
        if (error) {
            let errorMessage = 'Authentication failed';

            switch (error) {
                case 'AccessDenied':
                    errorMessage = message ? decodeURIComponent(message) : 'Access denied. Account not found. Please register first.';
                    break;
                case 'Configuration':
                    errorMessage = 'Server configuration error. Please try again later.';
                    break;
                case 'Verification':
                    errorMessage = 'Email verification failed.';
                    break;
                case 'CredentialsSignin':
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'OAuthSignin':
                case 'OAuthCallback':
                case 'OAuthCreateAccount':
                case 'GoogleLoginFailed':
                    errorMessage = message ? decodeURIComponent(message) : 'Google sign-in failed. Account may not exist.';
                    break;
                case 'EmailCreateAccount':
                    errorMessage = 'Unable to create account with this email.';
                    break;
                case 'Callback':
                    errorMessage = 'Authentication callback failed.';
                    break;
                default:
                    errorMessage = message ? decodeURIComponent(message) : 'Authentication failed. Please try again.';
            }

            console.log("Showing toast for error:", errorMessage);
            
            // Add a small delay to ensure the component is mounted
            setTimeout(() => {
                toast.error(errorMessage);
            }, 100);

            // Clean the URL by replacing the current state
            setTimeout(() => {
                router.replace('/signin');
            }, 3000); // Reduced delay
        }
    }, [searchParams, router]);

    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        console.log("Form submitted with values:", { email: values.email, password: "***" });
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false, // CRITICAL: Keep this false to handle errors manually
            });
            
            console.log("SignIn result:", result);

            if (result?.error) {
                console.log("SignIn error detected:", result.error);
                
                // Handle different error types
                let errorMessage = 'Sign-in failed';

                switch (result.error) {
                    case 'CredentialsSignin':
                        errorMessage = 'Invalid email or password';
                        break;
                    case 'AccessDenied':
                        errorMessage = 'Account not found. Please register first.';
                        break;
                    case 'Configuration':
                        errorMessage = 'Server configuration error. Please try again.';
                        break;
                    default:
                        errorMessage = result.error || 'Sign-in failed. Please try again.';
                }

                console.log("Showing toast error:", errorMessage);
                toast.error(errorMessage);
                
            } else if (result?.ok) {
                console.log("SignIn successful");
                toast.success("Sign-in successful!");

                // Get the session to determine redirect path
                const session = await getSession();
                
                if (session?.user?.role === 'admin') {
                    router.push('/admin');
                } else if (session?.user?.role === 'client') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
            } else {
                // This case handles when result is neither error nor ok
                console.log("Unexpected result state:", result);
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Sign-in exception:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        console.log("Google sign-in initiated");
        setGoogleLoading(true);

        try {
            // For debugging, you might want to use redirect: false first
            const result = await signIn("google", {
                redirect: true, // Change this to false for debugging
                // callbackUrl: '/auth/callback'
            });

            console.log("Google signin result:", result);

            if (result?.error) {
                console.log("Google signin error:", result.error);
                toast.error("Google sign-in failed. Please try again.");
                setGoogleLoading(false);
            } else if (result?.ok) {
                toast.success("Google sign-in successful!");
                // Handle redirect manually if needed
            }
            
        } catch (error) {
            console.error("Google sign-in exception:", error);
            toast.error("Failed to start Google sign-in. Please try again.");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            
            <Card className="w-full sm:w-4/5 md:w-3/6 lg:w-1/3 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">Sign in to your account</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading || loading}
                    >
                        {googleLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="john@example.com"
                                                {...field}
                                                className="bg-white"
                                                disabled={loading || googleLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Password</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                                className="bg-white"
                                                disabled={loading || googleLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={loading || googleLoading}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-blue-600 font-medium hover:text-blue-800">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}