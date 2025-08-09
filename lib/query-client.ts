// // lib/query-client-nextauth.ts
// import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
// import { toast } from 'sonner';
// import { signOut } from 'next-auth/react';
// import {
//   isAuthError,
//   isNetworkError,
//   isValidationError,
//   getErrorMessage,
//   getValidationErrors,
//   getErrorSeverity,
//   ErrorSeverity,
// } from '@/types/errors';

// // Global error handler with NextAuth integration
// const handleGlobalError = async (error: Error, query?: any) => {
//   console.error('Global Error:', error, query);
  
//   const severity = getErrorSeverity(error);
//   const message = getErrorMessage(error);
  
//   // Handle authentication errors with NextAuth
//   if (isAuthError(error)) {
//     toast.error('Session expired. Please sign in again.');
    
//     // Use NextAuth signOut instead of manual redirect
//     await signOut({
//       callbackUrl: '/auth/signin',
//       redirect: true,
//     });
//     return;
//   }
  
//   // Handle network errors
//   if (isNetworkError(error)) {
//     toast.error('Network error. Please check your connection.');
//     return;
//   }
  
//   // Handle validation errors
//   if (isValidationError(error)) {
//     const validationErrors = getValidationErrors(error);
//     if (validationErrors) {
//       const firstField = Object.keys(validationErrors)[0];
//       const firstError = validationErrors[firstField][0];
//       toast.error(`Validation Error: ${firstError}`);
//       return;
//     }
//   }
  
//   // Don't show toast for specific query keys that handle their own errors
//   if (query?.queryKey) {
//     const silentErrors = ['userProfile', 'backgroundSync', 'session'];
//     if (silentErrors.some((key: string) => query.queryKey.includes(key))) {
//       return;
//     }
//   }
  
//   // Show error based on severity
//   switch (severity) {
//     case ErrorSeverity.CRITICAL:
//       toast.error(`Critical Error: ${message}`, { duration: 10000 });
//       break;
//     case ErrorSeverity.HIGH:
//       toast.error(`Error: ${message}`, { duration: 6000 });
//       break;
//     case ErrorSeverity.MEDIUM:
//       toast.error(message, { duration: 4000 });
//       break;
//     case ErrorSeverity.LOW:
//       toast.warning(message, { duration: 3000 });
//       break;
//     default:
//       toast.error(message);
//   }
// };

// export const queryClient = new QueryClient({
//   queryCache: new QueryCache({
//     onError: async (error: Error, query) => {
//       await handleGlobalError(error, query);
//     },
//   }),
  
//   mutationCache: new MutationCache({
//     onError: async (error: Error, variables, context, mutation) => {
//       console.error('Mutation Error:', error, { variables, context, mutation });
      
//       // Handle auth errors for mutations
//       if (isAuthError(error)) {
//         toast.error('Session expired. Please sign in again.');
//         await signOut({
//           callbackUrl: '/auth/signin',
//           redirect: true,
//         });
//         return;
//       }
      
//       const message = getErrorMessage(error);
//       const severity = getErrorSeverity(error);
      
//       // Show mutation errors with appropriate severity
//       switch (severity) {
//         case ErrorSeverity.HIGH:
//         case ErrorSeverity.CRITICAL:
//           toast.error(`Operation Failed: ${message}`, { duration: 6000 });
//           break;
//         default:
//           toast.error(message);
//       }
//     },
//   }),
  
//   defaultOptions: {
//     queries: {
//       retry: (failureCount, error: Error) => {
//         // Don't retry auth errors
//         if (isAuthError(error)) return false;
        
//         // Don't retry client errors (except network issues)
//         if (isClientError(error) && !isNetworkError(error)) return false;
        
//         // Don't retry validation errors
//         if (isValidationError(error)) return false;
        
//         // Retry network errors and server errors up to 3 times
//         return failureCount < 3;
//       },
      
//       retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
//       staleTime: 5 * 60 * 1000,
//       gcTime: 10 * 60 * 1000,
//       refetchOnWindowFocus: false,
//       refetchOnReconnect: true,
//     },
    
//     mutations: {
//       retry: (failureCount, error: Error) => {
//         // Only retry network errors for mutations
//         if (isNetworkError(error) && failureCount < 1) return true;
//         return false;
//       },
//     },
//   },
// });

// // Import the missing functions
// import { isClientError } from '@/types/errors';