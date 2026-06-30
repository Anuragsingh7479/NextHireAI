"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { AtsCard } from "@/components/ats/AtsCard";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";
import * as data from "@/lib/data";
import type { Resume } from "@/lib/types";

export default function AtsPage() {
  const { user, hasAccess } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    let live = true;
    data.listResumes(user.uid).then((list) => {
      if (!live) return;
      setResumes(list);
      setSelected(list[0]?.id ?? "");
    });
    return () => {
      live = false;
    };
  }, [user]);

  if (!user) return null;

  const resume = resumes.find((r) => r.id === selected);

  return (
    <div>
      <PageHeader
        title="ATS Score Checker"
        subtitle="See how your resume scores against Applicant Tracking Systems."
      />

      {resumes.length === 0 ? (
        <EmptyState
          icon="◎"
          title="No resume to analyze"
          description="Create a resume first, then run the ATS analysis."
          action={<Button href="/resumes/new">Create a resume</Button>}
        />
      ) : (
        <div className="max-w-2xl">
          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs text-mute">Choose a resume</span>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-md border border-hairline bg-surface-elevated px-3 py-2.5 text-sm text-ink outline-none focus:border-hairline-strong"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} — {r.data.fullName}
                </option>
              ))}
            </select>
          </label>

          {resume && <AtsCard data={resume.data} isPro={hasAccess} />}
        </div>
      )}
    </div>
  );
}
