import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      storageUsed?: number;
      subscriptionExpiry?: Date;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    storageUsed?: number;
    subscriptionExpiry?: Date;
  }

  interface JWT {
    id: string;
    role?: string;
    storageUsed?: number;
    subscriptionExpiry?: Date;
  }
}
