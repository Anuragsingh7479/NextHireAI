"use client";

import { AuthProvider } from "./AuthProvider";
import { PremiumProvider } from "./PremiumProvider";

/** Client provider tree mounted once at the app root. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PremiumProvider>{children}</PremiumProvider>
    </AuthProvider>
  );
}
