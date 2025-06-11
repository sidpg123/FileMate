import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from 'jsonwebtoken'
import { JWT } from "next-auth/jwt";
import { toast } from "sonner";


async function refreshAccessToken(token: JWT) {
  // console.log("Refreshing access token", token);
  try {

    // console.log("Beaarer token", `Bearer ${token.refreshToken}`);

    const response = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.refreshToken}`,
        "Content-Type": "application/json"
      },
      // body: JSON.stringify({ refreshToken: token.refreshToken })
    });

    // console.log(response);

    const tokens = await response.json();

    // console.log(tokens);

    if (!response.ok) {
      throw tokens;
    }

    return {
      ...token,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}



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

        // console.log(email + "  " + password)
        if (!email || !password) {
          throw new Error("Invalid credentials");
        }

        try {

          console.log(`${process.env.API_SERVER_BASE_URL}/auth/login`);
          const res = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password
            }),
            headers: { "Content-Type": "application/json" }
          });
          if (!res.ok) {
            console.log("Response not ok", res.status, res.statusText);
            toast.error("Failed to fetch user data");
            throw new Error("Failed to fetch user data");
          }
          const parsedData = await res.json();

          if(parsedData.success === false) {
            console.log("Error in credentials log in", parsedData.message);
            //throw new Error(parsedData.message || "Credentials login failed");
            // toast.error(parsedData.message || "Credentials login failed");
            return null;
          }
          console.log("Parsed data",parsedData)
          const accessToken = parsedData.accessToken
          const refreshToken = parsedData.refreshToken
          const userInfo = parsedData?.user;
          // const accessTokenExpiresIn = parsedData?.accessTokenExpiresIn;
          // console.log("accessTokenExpiresIn", accessTokenExpiresIn);
          console.log("UserInfo", userInfo);
          // console.log("parsedData", parsedData);
          return {
            accessToken,
            refreshToken,
            // accessTokenExpiresIn,
            id: userInfo.id,
            name: userInfo.name,
            // storageUsed: userInfo.storageUsed,
            subscriptionExpiry: userInfo.subscriptionExpiry,
            role: userInfo?.role,
            // email: userInfo?.email
          }

        } catch (error) {
          console.log(error)
          throw new Error(`Authorization error`);
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: '/signin'
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // console.log("user in signIn", user);
      // console.log("account in signIn", account);
      // console.log("profile in signIn", profile);

      if (account?.provider === "google") {
        // console.log("Google Sign In");
        console.log("profile in google sign in", profile);
        console.log("account in google sign in", account);
        console.log("user in google sign in", user);

        if (!profile || !profile.email_verified) {
          console.log("Email not verified");
          throw new Error("Email not verified");
        }

        if (!profile.email) {
          console.log("Email not found in profile");
          throw new Error("Email not found in profile");
        }

        const res = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/google-login`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: profile.email }),
        });

        const data = await res.json();
        if (data.success === false) {
          console.log("Error in google login", data.message);
          throw new Error(data.message || "Google login failed");
        }
        else {
          user.accessToken = data.accessToken;
          user.databaseId = data.id;
          user.refreshToken = data.refreshToken;
          user.role = data.role;
          user.subscriptionExpiry = data.subscriptionExpiry;
          user.id = data.id;
        }

        return true;
      }

      if (account?.provider === "credentials") {
        // console.log("Credentials Sign In");
        return true;
      }

      return false; // Reject sign-in for other providers
    },
    jwt: async ({ token, user, account }) => {


      if (token.accessToken) {
        const decodedToken = jwt.decode(token.accessToken);
        // console.log("decodedToken", decodedToken);
        if (decodedToken && typeof decodedToken === 'object' && 'exp' in decodedToken && typeof decodedToken.exp === 'number') {
          token.accessTokenExpiresIn = decodedToken.exp * 1000;
          if ('id' in decodedToken && typeof decodedToken.id === 'string') {
            token.id = decodedToken.id;
            // console.log("Extracted ID from JWT:", decodedToken.id);
          }
          if ('role' in decodedToken && typeof decodedToken.role === 'string') {
            token.role = decodedToken.role;
            // console.log("Extracted role from JWT:", decodedToken.role);
          }
        } else {
          token.accessTokenExpiresIn = undefined;
        }
      }


      if (user) {
         if (user.databaseId) {
          token.id = user.databaseId as string; // Use database ID for Google users
          console.log("Using database ID for Google user:", user.databaseId);
        } else {
          token.id = user.id as string; // Use regular ID for credential users
          console.log("Using regular ID for credential user:", user.id);
        }
        token.role = user.role;
        // token.storageUsed = user.storageUsed;
        token.subscriptionExpiry = user.subscriptionExpiry;
        token.accessToken = user.accessToken;
        token.accessTokenExpiresIn = user.accessTokenExpiresIn; // Ensure this is set
        token.refreshToken = user.refreshToken; 
        return token;
      }



      if (Date.now() < token.accessTokenExpiresIn!) {
        return token;
      }

      return refreshAccessToken(token);

    },
    session: async ({ session, token }) => {

      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
        session.accessToken = token.accessToken as string;
        session.accessTokenExpiresIn = token.accessTokenExpiresIn as number | undefined;
        session.refreshToken = token.refreshToken as string;
          // session.user.storageUsed = token.storageUsed as number | undefined;
      }
      
        return session;

    },

    // redirect: async ({ url, baseUrl }) => {
    //   const session = await auth();
    //   if(!session?.user.id) {
    //     return baseUrl;
    //   }
    //   if (session.user.role === 'user') return `${baseUrl}/dashboard`;
    //   if (session.user.role === 'user') return `${baseUrl}/admin`;
    //   if (session.user.role === 'client') return `${baseUrl}/dashboard`;
    //   return baseUrl;
    // }
  }
})