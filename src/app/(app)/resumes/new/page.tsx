"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import * as data from "@/lib/data";
import { uid, blankResumeData } from "@/lib/data";
import type { Resume } from "@/lib/types";

/** Creates a fresh resume then redirects into the builder. */
export default function NewResumePage() {
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
    const r: Resume = {
      id: uid(),
      title: "Untitled resume",
      template: "modern",
      data: blankResumeData(user.name, user.email),
      createdAt: now,
      updatedAt: now,
    };
    data.saveResume(user.uid, r).then(() => router.replace(`/resumes/${r.id}`));
  }, [user, loading, router]);

  return <div className="text-sm text-mute">Creating your resume…</div>;
}
