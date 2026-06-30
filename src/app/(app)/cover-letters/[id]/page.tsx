"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { CoverLetterBuilder } from "@/components/cover/CoverLetterBuilder";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";
import * as data from "@/lib/data";
import type { CoverLetter } from "@/lib/types";

export default function CoverLetterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const [cl, setCl] = useState<CoverLetter | null | undefined>(undefined);

  useEffect(() => {
    if (loading || !user) return;
    let live = true;
    data.getCoverLetter(user.uid, id).then((c) => live && setCl(c ?? null));
    return () => {
      live = false;
    };
  }, [user, loading, id]);

  if (cl === undefined) return <div className="text-sm text-mute">Loading…</div>;
  if (cl === null) {
    return (
      <EmptyState
        icon="✕"
        title="Cover letter not found"
        description="This cover letter doesn't exist or was deleted."
        action={<Button href="/cover-letters">Back</Button>}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 text-xs text-stone">
        <Link href="/cover-letters" className="hover:text-ink">
          ← All cover letters
        </Link>
      </div>
      <CoverLetterBuilder initial={cl} />
    </div>
  );
}
