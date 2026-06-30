// ─────────────────────────────────────────────────────────────────────────────
// Mock AI generators. These stand in for server-side OpenAI calls so every AI
// button works today. In production each function becomes a fetch() to a route
// under /api/ai/* that verifies auth + subscription and calls OpenAI server-side.
// ─────────────────────────────────────────────────────────────────────────────

import type { ResumeData, AtsReport, CoverLetterStyle } from "@/lib/types";

const wait = (ms = 650) => new Promise((r) => setTimeout(r, ms));

export async function aiSummary(d: ResumeData): Promise<string> {
  await wait();
  const role = d.jobTitle || "professional";
  return `Results-driven ${role} with a track record of delivering high-impact work. Combines strong technical skills with clear communication to ship outcomes that move key metrics. Known for ownership, fast iteration, and raising the bar for quality.`;
}

export async function aiImprove(text: string): Promise<string> {
  await wait();
  const trimmed = text.trim().replace(/\.$/, "");
  return `${trimmed}, with measurable, business-facing impact.`;
}

export async function aiBullets(role: string): Promise<string[]> {
  await wait();
  return [
    `Led a key initiative as ${role || "owner"}, improving a core metric by 30%+.`,
    "Partnered cross-functionally to ship on time and under scope.",
    "Introduced process improvements that reduced rework and sped delivery.",
  ];
}

export async function aiSkills(role: string): Promise<string[]> {
  await wait();
  const base = ["Communication", "Problem Solving", "Collaboration", "Project Management"];
  if (/engineer|develop|software|frontend|backend/i.test(role))
    return ["React", "TypeScript", "Node.js", "System Design", "Testing", "CI/CD"];
  if (/design/i.test(role)) return ["Figma", "Design Systems", "Prototyping", "User Research"];
  if (/market/i.test(role)) return ["SEO", "Content Strategy", "Analytics", "Campaign Management"];
  return base;
}

export async function aiProjects(role: string): Promise<{ name: string; description: string }[]> {
  await wait();
  return [
    {
      name: "Portfolio Platform",
      description: `Built and shipped a project relevant to a ${role || "professional"} role, end to end.`,
    },
  ];
}

export async function aiAtsReport(d: ResumeData, jobKeywords: string[] = []): Promise<AtsReport> {
  await wait(800);
  const text = JSON.stringify(d).toLowerCase();
  const wanted =
    jobKeywords.length > 0
      ? jobKeywords
      : ["leadership", "metrics", "stakeholders", "automation", "testing", "roadmap"];
  const missing = wanted.filter((k) => !text.includes(k.toLowerCase()));
  const filled = wanted.length - missing.length;
  const base = 55 + Math.round((filled / Math.max(1, wanted.length)) * 35);
  const bulletCount = d.experience.reduce((n, e) => n + e.bullets.filter(Boolean).length, 0);
  const score = Math.min(98, base + Math.min(8, bulletCount));
  return {
    score,
    summary:
      "Your resume is readable by most Applicant Tracking Systems. Add the missing role-specific keywords and quantify more bullet points to improve your match rate.",
    missingKeywords: missing.length ? missing : ["(great keyword coverage)"],
    grammar: [
      "Prefer active voice in 2 experience bullets.",
      "Keep tense consistent across past roles.",
    ],
    tips: [
      "Quantify at least 3 bullets with concrete numbers.",
      "Mirror keywords from the target job description.",
      "Keep the resume to one page for most roles.",
    ],
  };
}

export async function aiCoverLetter(
  name: string,
  role: string,
  company: string,
  style: CoverLetterStyle
): Promise<string> {
  await wait(800);
  const openers: Record<CoverLetterStyle, string> = {
    professional: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${role || "open"} role at ${company || "your company"}.`,
    enthusiastic: `Hi ${company || "team"},\n\nI was thrilled to see the ${role || "open"} opening — it's exactly the kind of work I love.`,
    concise: `Dear ${company || "Hiring Team"},\n\nI'm applying for the ${role || "open"} role. Here's why I'm a strong fit.`,
    creative: `Hello ${company || "there"},\n\nGreat products start with people who care. That's why the ${role || "open"} role caught my eye.`,
  };
  return `${openers[style]}\n\nOver my career I've consistently delivered measurable results and collaborated across teams to ship work that matters. I'm confident I can bring the same impact to ${company || "your team"}.\n\nThank you for your time and consideration. I'd welcome the chance to discuss how I can contribute.\n\nWarm regards,\n${name || "Your Name"}`;
}
