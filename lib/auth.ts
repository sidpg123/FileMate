import jwt from 'jsonwebtoken';
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

async function refreshAccessToken(token: JWT) {
  try {
    console.log("Attempting to refresh token for user:", token.id, "at ", Date.now());

    const response = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.refreshToken}`,
        "Content-Type": "application/json"
      },
    });

    const tokens = await response.json();
    // console.log("Refresh response status:", response.status);

    if (!response.ok) {
      console.error("Token refresh failed:", tokens);
      throw new Error(tokens.message || "Token refresh failed");
    }

    console.log("Token refreshed successfully");
    return {
      ...token,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? token.refreshToken,
      accessTokenExpiresIn: undefined, // Will be recalculated from new token
      error: undefined, // Clear any previous errors
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
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
          console.error("Missing email or password");
          return null;
        }

        try {
          const res = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }
          });

          if (!res.ok) {
            console.error("Login request failed:", res.status, res.statusText);
            return null;
          }

          const parsedData = await res.json();

          if (parsedData.success === false) {
            console.error("Login failed:", parsedData.message);
            return null;
          }

          const userInfo = parsedData.user;
          return {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            role: userInfo.role,
            accessToken: parsedData.accessToken,
            refreshToken: parsedData.refreshToken,
            // subscriptionExpiry: userInfo.subscriptionExpiry,
          };

        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days to match refresh token
  },

  pages: {
    signIn: '/signin',
    error: '/signin'
  },

  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === "google") {
        if (!profile?.email_verified || !profile?.email) {
          console.error("Google profile verification failed");
          return false; // This will trigger an error
        }

        try {
          const res = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/google-login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: profile.email }),
          });

          const data = await res.json();
          
          if (!res.ok || data.success === false) {
            console.error("Google login failed:", data.message);
            // Store error details for the error page
            const error = new Error("GoogleLoginFailed");
            error.cause = {
              message: data.message || 'Account not found',
              statusCode: res.status
            };
            throw error;
          }

          // Set user data from backend response
          user.id = data.user.id;
          user.name = data.user.name;
          user.email = data.user.email;
          user.role = data.user.role;
          user.accessToken = data.accessToken;
          user.refreshToken = data.refreshToken;

          return true;
        } catch (error) {
          console.error("Google login error:", error);
          // Re-throw the error to be handled by NextAuth's error handling
          throw error;
        }
      }

      if (account?.provider === "credentials") {
        return user ? true : false;
      }

      return false;
    },

    jwt: async ({ token, user, trigger }) => {
      // Handle new sign-ins
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.error = undefined;
      }

      // Calculate expiration time from current access token
      if (token.accessToken && !token.accessTokenExpiresIn) {
        try {
          const decodedToken = jwt.decode(token.accessToken) as jwt.JwtPayload;
          if (decodedToken?.exp) {
            token.accessTokenExpiresIn = decodedToken.exp * 1000;
          }
        } catch (error) {
          console.error("Error decoding access token:", error);
        }
      }

      // Handle token refresh
      if (token.accessTokenExpiresIn && Date.now() >= token.accessTokenExpiresIn - 60000) { // Refresh 1 minute before expiry
        console.log("Token expired, refreshing...");
        return await refreshAccessToken(token);
      }

      // Handle manual refresh triggers
      if (trigger === "update" && token.error === "RefreshAccessTokenError") {
        return await refreshAccessToken(token);
      }

      return token;
    },

    session: async ({ session, token }) => {

      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.accessTokenExpiresIn = token.accessTokenExpiresIn as number;

      return session;
    },
  }
});