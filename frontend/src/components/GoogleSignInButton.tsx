import { useState } from 'react';
import { useAuth } from '../auth/useAuth';

interface GoogleSignInButtonProps {
  onError?: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleSignInButton({ onError, disabled }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const { googleSignin } = useAuth();

  const handleGoogleSignIn = () => {
    setLoading(true);
    
    // Debug logging
    console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
    console.log("Current origin:", window.location.origin);
    
    // Check if Google Identity Services is loaded
    if (!window.google) {
      console.error("Google Identity Services not loaded");
      onError?.("Google Sign-In is not available. Please refresh the page.");
      setLoading(false);
      return;
    }

    try {
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            console.log("Google response received:", response);
            // Send the ID token to our backend
            await googleSignin(response.credential);
            setLoading(false);
          } catch (error) {
            console.error("Google sign-in failed:", error);
            onError?.("Google sign-in failed. Please try again.");
            setLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      // Use renderButton instead of prompt for better reliability
      window.google.accounts.id.renderButton(
        // We'll create this element dynamically
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with'
        }
      );
      
      // Fallback: If renderButton doesn't work, use prompt
      setTimeout(() => {
        window.google.accounts.id.prompt((notification: any) => {
          console.log("Google prompt notification:", notification);
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setLoading(false);
            onError?.("Google Sign-In was blocked. Please allow popups and try again.");
          }
        });
      }, 100);
      
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
      onError?.("Failed to initialize Google Sign-In.");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Hidden div for Google's renderButton */}
      <div id="google-signin-button" className="hidden"></div>
      
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || loading}
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            <span>Signing in with Google...</span>
          </>
        ) : (
          <>
            {/* Google Icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </>
        )}
      </button>
    </div>
  );
}