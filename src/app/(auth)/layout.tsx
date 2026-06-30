import { Logo } from "@/components/landing/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="hero-stripe" aria-hidden />
      <div className="relative z-[1] mb-8">
        <Logo />
      </div>
      <div className="relative z-[1] w-full max-w-[400px]">{children}</div>
    </div>
  );
}
