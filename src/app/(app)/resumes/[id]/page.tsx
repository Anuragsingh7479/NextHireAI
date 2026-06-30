"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";
import * as data from "@/lib/data";
import type { Resume } from "@/lib/types";

export default function ResumeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const [resume, setResume] = useState<Resume | null | undefined>(undefined);

  useEffect(() => {
    if (loading || !user) return;
    let live = true;
    data.getResume(user.uid, id).then((r) => live && setResume(r ?? null));
    return () => {
      live = false;
    };
  }, [user, loading, id]);

  if (resume === undefined) {
    return <div className="text-sm text-mute">Loading resume…</div>;
  }

  if (resume === null) {
    return (
      <EmptyState
        icon="✕"
        title="Resume not found"
        description="This resume doesn't exist or was deleted."
        action={<Button href="/resumes">Back to resumes</Button>}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 text-xs text-stone">
        <Link href="/resumes" className="hover:text-ink">
          ← All resumes
        </Link>
      </div>
      <ResumeBuilder initial={resume} />
    </div>
  );
}
