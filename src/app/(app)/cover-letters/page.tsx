"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import * as data from "@/lib/data";
import type { CoverLetter } from "@/lib/types";

export default function CoverLettersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CoverLetter[]>([]);

  const reload = () => {
    if (user) data.listCoverLetters(user.uid).then(setItems);
  };
  useEffect(reload, [user]);

  if (!user) return null;

  async function remove(c: CoverLetter) {
    if (!confirm(`Delete "${c.title}"?`)) return;
    await data.deleteCoverLetter(user!.uid, c.id);
    reload();
  }

  return (
    <div>
      <PageHeader
        title="Cover Letters"
        subtitle="Generate tailored, company-specific cover letters with AI."
        action={<Button onClick={() => router.push("/cover-letters/new")}>+ New Cover Letter</Button>}
      />

      {items.length === 0 ? (
        <EmptyState
          icon="✎"
          title="No cover letters yet"
          description="Create a tailored cover letter for a specific company and role."
          action={<Button onClick={() => router.push("/cover-letters/new")}>Create one</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <div className="flex-1">
                <div className="text-base font-medium text-ink">{c.title}</div>
                <div className="mt-1 text-xs text-mute">
                  {c.company || "—"} · {c.style}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button href={`/cover-letters/${c.id}`} size="sm">
                  Edit
                </Button>
                <button
                  onClick={() => remove(c)}
                  className="ml-auto rounded-md px-2 py-1.5 text-[13px] text-mute hover:text-accent-red"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
