import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <PublicNav />
      <main className="flex-1 flex flex-col min-h-0">{children}</main>
      <Footer />
    </div>
  );
}
