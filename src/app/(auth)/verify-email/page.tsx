"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Card className="p-7 text-center">
      <div className="text-3xl">📩</div>
      <h1 className="mt-3 text-xl font-semibold tracking-[-0.3px]">Verify your email</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-mute">
        We sent a verification link to{" "}
        <b className="text-ink">{user?.email ?? "your email"}</b>. Click it to confirm your account.
      </p>
      <Button className="w-full" onClick={() => router.push("/dashboard")}>
        Continue to dashboard
      </Button>
      <p className="mt-4 text-sm text-mute">
        Entered the wrong email?{" "}
        <Link href="/signup" className="text-ink hover:underline">
          Sign up again
        </Link>
      </p>
      <p className="mt-3 text-[11px] text-stone">
        Demo mode skips real email delivery. Firebase email verification is wired in Phase 2.
      </p>
    </Card>
  );
}
