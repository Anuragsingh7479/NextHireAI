"use client";

import { useEffect } from "react";

/** Pings /api/track once per browser session to count unique visits. */
export function VisitorTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("nh.tracked")) return;
      sessionStorage.setItem("nh.tracked", "1");
      fetch("/api/track", { method: "POST" }).catch(() => {});
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}
