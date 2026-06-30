"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import * as data from "@/lib/data";
import { uid } from "@/lib/data";
import type { CoverLetter } from "@/lib/types";

export default function NewCoverLetterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (loading || done.current) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    done.current = true;
    const now = Date.now();
    const cl: CoverLetter = {
      id: uid(),
      title: "Untitled cover letter",
      company: "",
      role: "",
      style: "professional",
      body: "",
      createdAt: now,
      updatedAt: now,
    };
    data.saveCoverLetter(user.uid, cl).then(() => router.replace(`/cover-letters/${cl.id}`));
  }, [user, loading, router]);

  return <div className="text-sm text-mute">Creating your cover letter…</div>;
}
