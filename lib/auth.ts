import jwt from 'jsonwebtoken';
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Constants
const REFRESH_BUFFER_TIME = 60 * 1000; // 1 minute
const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_COOLDOWN = 5 * 60 * 1000; // 5 minutes between failed attempts

// Error classification
enum RefreshErrorType {
  NETWORK_ERROR = "NetworkError",
  INVALID_TOKEN = "InvalidToken",
  USER_NOT_FOUND = "UserNotFound",
  RATE_LIMITED = "RateLimited",
  SERVER_ERROR = "ServerError",
  PERMANENT_ERROR = "PermanentError"
}

interface RefreshError {
  type: RefreshErrorType;
  shouldRetry: boolean;
  shouldSignOut: boolean;
  message: string;
}

interface ErrorResponse {
    success: boolean;
    error: string;
    message: string;
    timestamp: string;
}

function classifyRefreshError(response: Response | null, errorData: ErrorResponse | null, networkError?: Error): RefreshError {
  // Network/fetch errors
  if (!response || networkError) {
    return {
      type: RefreshErrorType.NETWORK_ERROR,
      shouldRetry: true,
      shouldSignOut: false,
      message: "Network error - will retry"
    };
  }

  const status = response.status;
  const message = errorData?.message?.toLowerCase() || '';

  // Rate limiting
  if (status === 429) {
    return {
      type: RefreshErrorType.RATE_LIMITED,
      shouldRetry: false,
      shouldSignOut: false,
      message: "Rate limited - cooling down"
    };
  }

  // Authentication/Authorization errors (permanent)
  if (status === 401 || status === 403) {
    // Specific cases that require sign out
    if (message.includes('user not found') ||
      message.includes('account not found') ||
      message.includes('account not active') ||
      message.includes('invalid signature') ||
      message.includes('invalid refresh token') ||
      message.includes('token expired')) {
      return {
        type: RefreshErrorType.PERMANENT_ERROR,
        shouldRetry: false,
        shouldSignOut: true,
        message: "Authentication failed permanently"
      };
    }

    return {
      type: RefreshErrorType.INVALID_TOKEN,
      shouldRetry: false,
      shouldSignOut: true,
      message: "Token authentication failed"
    };
  }

  // Server errors (might be temporary)
  if (status >= 500) {
    return {
      type: RefreshErrorType.SERVER_ERROR,
      shouldRetry: true,
      shouldSignOut: false,
      message: "Server error - will retry"
    };
  }

  // Other 4xx errors (permanent)
  return {
    type: RefreshErrorType.PERMANENT_ERROR,
    shouldRetry: false,
    shouldSignOut: true,
    message: "Request failed permanently"
  };
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  const now = Date.now();
  const lastAttempt = (token.lastRefreshAttempt as number) || 0;
  const attemptCount = (token.refreshAttempts as number) || 0;

  // Check if we've exceeded max attempts
  if (attemptCount >= MAX_REFRESH_ATTEMPTS) {
    console.error("Max refresh attempts exceeded for user:", token.id);
    return {
      ...token,
      error: RefreshErrorType.PERMANENT_ERROR,
      shouldSignOut: true,
      errorMessage: "Maximum refresh attempts exceeded"
    };
  }

  // Check cooldown period for failed attempts
  if (attemptCount > 0 && (now - lastAttempt) < REFRESH_COOLDOWN) {
    console.log("Refresh cooldown active for user:", token.id);
    return {
      ...token,
      error: RefreshErrorType.RATE_LIMITED,
      errorMessage: "Cooldown period active"
    };
  }

  console.log(`Attempting token refresh for user: ${token.id} (attempt ${attemptCount + 1}/${MAX_REFRESH_ATTEMPTS})`);

  let response: Response | null = null;
  // let errorData: any = {};
  let networkError: Error | undefined;

  try {
    response = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token.refreshToken}`,
        "Content-Type": "application/json"
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    const errorData = await response.json();

    if (!response.ok) {
      const error = classifyRefreshError(response, errorData);

      console.error("Token refresh failed:", {
        status: response.status,
        error: error,
        userId: token.id,
        attempt: attemptCount + 1
      });

      return {
        ...token,
        error: error.type,
        shouldSignOut: error.shouldSignOut,
        errorMessage: error.message,
        lastRefreshAttempt: now,
        refreshAttempts: error.shouldRetry ? attemptCount + 1 : MAX_REFRESH_ATTEMPTS,
        accessToken: error.shouldSignOut ? undefined : token.accessToken,
        refreshToken: error.shouldSignOut ? undefined : token.refreshToken
      };
    }

    // Success case
    console.log("Token refreshed successfully for user:", token.id);

    return {
      ...token,
      accessToken: errorData.accessToken,
      refreshToken: errorData.refreshToken ?? token.refreshToken,
      accessTokenExpiresIn: undefined, // Will be recalculated
      // Clear error state
      error: undefined,
      shouldSignOut: undefined,
      errorMessage: undefined,
      lastRefreshAttempt: undefined,
      refreshAttempts: undefined,
    };

  } catch (err) {
    networkError = err as Error;
    console.error("Network error during token refresh:", err);

    const error = classifyRefreshError(null, null, networkError);

    return {
      ...token,
      error: error.type,  
      shouldSignOut: false, // Don't sign out on network errors
      errorMessage: error.message,
      lastRefreshAttempt: now,
      refreshAttempts: attemptCount + 1,
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

        if (!email?.trim() || !password?.trim()) {
          console.error("Missing or empty email/password");
          return null;
        }

        try {
          const res = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email: email.trim(), password }),
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(10000) // 10 second timeout
          });

          const parsedData = await res.json();

          if (!res.ok || parsedData.success === false) {
            console.error("Login failed:", {
              status: res.status,
              message: parsedData.message
            });
            return null;
          }

          const userInfo = parsedData.user;

          // Validate response structure
          if (!userInfo?.id || !parsedData.accessToken || !parsedData.refreshToken) {
            console.error("Invalid login response structure");
            return null;
          }

          return {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            role: userInfo.role,
            accessToken: parsedData.accessToken,
            refreshToken: parsedData.refreshToken,
          };

        } catch (error) {
          console.error("Login network error:", error);
          return null;
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: '/signin',
    error: '/signin'
  },

  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === "google") {
        if (!profile?.email_verified || !profile?.email?.trim()) {
          console.error("Google profile verification failed");
          return false;
        }

        try {
          const res = await fetch(`${process.env.API_SERVER_BASE_URL}/auth/google-login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: profile.email.trim() }),
            signal: AbortSignal.timeout(10000)
          });

          const data = await res.json();

          if (!res.ok || data.success === false) {
            console.error("Google login failed:", {
              status: res.status,
              message: data.message
            });

            const error = new Error("GoogleLoginFailed");
            error.cause = {
              message: data.message || 'Google login failed',
              statusCode: res.status
            };
            throw error;
          }

          // Validate response
          if (!data.user?.id || !data.accessToken || !data.refreshToken) {
            throw new Error("Invalid Google login response");
          }

          user.id = data.user.id;
          user.name = data.user.name;
          user.email = data.user.email;
          user.role = data.user.role;
          user.accessToken = data.accessToken;
          user.refreshToken = data.refreshToken;

          return true;
        } catch (error) {
          console.error("Google login error:", error);
          throw error;
        }
      }

      if (account?.provider === "credentials") {
        return !!user;
      }

      return false;
    },

    jwt: async ({ token, user, trigger }) => {
      // Handle new sign-ins
      if (user) {
        console.log("New sign-in for user:", user.id);
        token.id = user.id!;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        // Clear any previous error state
        token.error = undefined;
        token.shouldSignOut = undefined;
        token.errorMessage = undefined;
        token.lastRefreshAttempt = undefined;
        token.refreshAttempts = undefined;
      }

      // If we have a permanent error requiring sign out, return immediately
      if (token.shouldSignOut) {
        signOut();
        console.log("Token marked for sign out:", token.error);
        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
        };
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
          // If we can't decode the token, try to refresh it
          return await refreshAccessToken(token);
        }
      }

      // Handle automatic token refresh (only if no current error)
      const now = Date.now();
      const shouldAutoRefresh = token.accessTokenExpiresIn &&
        now >= token.accessTokenExpiresIn - REFRESH_BUFFER_TIME &&
        !token.error;

      if (shouldAutoRefresh) {
        console.log("Auto-refreshing token for user:", token.id);
        return await refreshAccessToken(token);
      }

      // Handle manual refresh triggers (only for retryable errors)
      if (trigger === "update" && token.error) {
        const retryableErrors = [RefreshErrorType.NETWORK_ERROR, RefreshErrorType.SERVER_ERROR];

        if (retryableErrors.includes(token.error as RefreshErrorType)) {
          console.log("Manual refresh triggered for user:", token.id);
          return await refreshAccessToken(token);
        } else {
          console.log("Not retrying due to permanent error:", token.error);
        }
      }

      return token;
    },

    session: async ({ session, token }) => {
      // If there's a sign-out error, return a session that will trigger sign out
      if (token.shouldSignOut) {
        console.log("Session callback: shouldSignOut detected, will trigger sign out");
        return {
          ...session,
          error: token.error,
          shouldSignOut: true,
          user: {
            ...session.user,
            id: token.id as string,
          }
        };
      }

      // Normal session
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.accessTokenExpiresIn = token.accessTokenExpiresIn as number;

      // Include error information if present (but not for sign out)
      // if (token.error && !token.shouldSignOut) {
      //   session.error = token.error as string;
      //   session.errorMessage = token.errorMessage as string;
      // }

      return session;
    },
  }
});