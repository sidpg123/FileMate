"use server";

import { signInSchema, signUpSchema } from "@/zodSchem/auth";
import { z } from "zod";
import db from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";

export const handleSignUp = async ({ name, email, password }: z.infer<typeof signUpSchema>) => {
    try {
        // Validate input with Zod
        const validatedData = signUpSchema.parse({ name, email, password });

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            console.log("User already exist")
            throw new Error("User with this email already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create new user
        const newUser = await db.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                passwordHash: hashedPassword,
                role: "User",
                subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            },
        });

        return { success: true, message: "User registered successfully!", user: newUser };
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