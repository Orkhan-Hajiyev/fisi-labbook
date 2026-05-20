import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
