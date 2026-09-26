import { AnnouncementBar, Button, Card, DisclaimerBanner, FitMeter, Hero, ProductCard, TryOnViewer } from "@/components/design-system/components";

export default function DesignPage() {
  return (
    <main style={{ background: "#FFF7F2" }}>
      <AnnouncementBar>NEW DROP · INCLUSIVE 2–40 + M-L OVERLAP · LIVE TRY-ON NEVER STORED 🔒</AnnouncementBar>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
        <Hero>
          <h1 style={{ fontSize: 44, fontWeight: 900 }}>Wear it before you buy it.</h1>
          <p>Overlap XXS-XS → XXXL-XXXXL · 2–40 · world regions. Live preview never stored.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <Button>Find my size</Button><Button dark>🔒 Live try-on</Button>
          </div>
        </Hero>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 16 }}>
          <ProductCard name="Bodycon Dress" price="₦18,500" sizes={["M-L", "L"]} tag="HOT" />
          <ProductCard name="Wrap Top" price="₦9,800" sizes={["S", "S-M"]} tag="NEW" />
          <ProductCard name="Wide-Leg" price="₦14,200" sizes={["L-XL"]} tag="" />
          <ProductCard name="Trench" price="₦32,000" sizes={["XXL"]} tag="" />
        </div>
        <Card><FitMeter area="Bust" label="Good" /><FitMeter area="Waist" label="Slightly fitted" /></Card>
        <TryOnViewer live />
        <DisclaimerBanner>AI look vs measurement-based fit — labeled separately.</DisclaimerBanner>
      </div>
    </main>
  );
}
