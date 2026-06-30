import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";

// Landing page. Server component — fully static, SEO-friendly.
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
