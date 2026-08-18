import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main style={{ flex: '1 0 auto' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
