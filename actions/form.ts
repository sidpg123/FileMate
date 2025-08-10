"use server";

import { signInSchema, signUpSchema } from "@/zodSchem/auth";
import { z } from "zod";
// import db from "@/prisma/prisma";
import { signIn } from "@/lib/auth";

export const handleSignUp = async ({ name, email, password }: z.infer<typeof signUpSchema>) => {
    try {
        // Validate input with Zod
        const validatedData = signUpSchema.parse({ name, email, password });
        //console.log("validatedData", validatedData);
        //console.log(typeof(name))
       //backend request to register user
        const response = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },  
            body: JSON.stringify({
                name: validatedData.name,
                email: validatedData.email,
                password: validatedData.password
            })  
        })
        //console.log("response", response);
        

        if(response.status === 409) {
            return { success: false, message: "User with this email already exists." };
        }

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, message: errorData.message || "Something went wrong!" };
        }
        
        return { success: true, message: "User registered successfully!", };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: error.message || "Something went wrong!" };
        } else {
            return { success: false, message: "An unknown error occurred." };
        }
    }
};


export const handleSignIn = async ({ email, password }: z.infer<typeof signInSchema>) => {
    try {
        // Validate input with Zod
        const validatedData = signInSchema.parse({ email, password });

        await signIn('credentials', {
            email: validatedData.email,
            password: validatedData.password,
            redirect: true,
            redirectTo: "/"
        })

        

    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: error.message || "Something went wrong!" };
        } else {
            return { success: false, message: "An unknown error occurred." };
        }
    }
};

export const handleGoogle = async () => {
    try {
        await signIn("google", { callbackUrl: "/" });
      } catch (error) {
        console.error("Google sign-in failed", error);
      }
} 