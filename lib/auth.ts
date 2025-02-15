import db from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@demo.com", required: true },
        password: { label: "Password", type: "password", placeholder: "password", required: true }
      },
      async authorize(credentials) {

        const { email, password } = credentials as { email: string; password: string };

        if (!email || !password) {
          throw new Error("Invalid credentials");
        }

        try {
          const existingUser = await db.user.findUnique({
            where: { email },
          });

          if (!existingUser) {
            throw new Error("User not found");
          }

          const isVerified = await bcrypt.compare(password, existingUser.passwordHash);

          if (!isVerified) {
            console.log("Wrong Password")
            throw new Error("Invalid password");
          }

          return {
            id: existingUser.id.toString(),
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
            storageUsed: existingUser.storageUsed,
            subscriptionExpiry: existingUser.subscriptionExpiry,
          };
        } catch (error) {
          console.log(error)
          throw new Error(`Authorization error`);
        }
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.storageUsed = user.storageUsed;
        token.subscriptionExpiry = user.subscriptionExpiry;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
        session.user.storageUsed = token.storageUsed as number | undefined;
        session.user.subscriptionExpiry = token.subscriptionExpiry as Date | undefined;
      }
      return session;
    },
  }
})