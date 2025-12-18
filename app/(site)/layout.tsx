import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Header />
      </div>
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
