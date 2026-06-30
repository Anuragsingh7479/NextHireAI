"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/app/PageHeader";

export default function AccountPage() {
  const { user, signOut, updateName } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [savedMsg, setSavedMsg] = useState("");

  if (!user) return null;

  async function save() {
    await updateName(name);
    setSavedMsg("Saved");
    setTimeout(() => setSavedMsg(""), 1500);
  }

  return (
    <div>
      <PageHeader title="Account" subtitle="Manage your profile and session." />

      <div className="grid max-w-2xl gap-4">
        <Card>
          <h2 className="mb-4 text-sm font-semibold">Profile</h2>
          <div className="space-y-4">
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email">
              <Input value={user.email} disabled className="opacity-60" />
            </Field>
            <div className="flex items-center gap-3">
              <Button onClick={save}>Save changes</Button>
              {savedMsg && <span className="text-sm text-accent-green">✓ {savedMsg}</span>}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold">Session</h2>
          <p className="mt-1 text-sm text-mute">Sign out of your account on this device.</p>
          <div className="mt-4">
            <Button
              variant="install"
              onClick={() => {
                signOut();
                router.replace("/login");
              }}
            >
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
