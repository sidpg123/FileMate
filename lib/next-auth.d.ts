import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn?: number; // in milliseconds
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      subscriptionExpiry?: Date;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    subscriptionExpiry?: Date;
    accessToken: string;
    databaseId?: string; // Optional, if you want to store a database ID
    accessTokenExpiresIn?: number; // in milliseconds
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role?: string;
    subscriptionExpiry?: Date;
    accessTokenExpiresIn?: number; // in milliseconds
    accessToken?: string;
    refreshToken?: string;
  }
}