import { NavBar } from "@/components/landing/NavBar";
import { Footer } from "@/components/landing/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto w-full max-w-container flex-1 px-6 py-12">{children}</main>
      <Footer />
    </div>
  );
}
