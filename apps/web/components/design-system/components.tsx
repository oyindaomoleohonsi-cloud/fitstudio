// FitStudio vibrant fashion design-system library.
import "./tokens.css";

export function Button({ children, primary, dark, ...p }: any) {
  const cls = primary ? "ds-btn-primary" : dark ? "ds-btn-dark" : "";
  return <button className={`ds-btn ${cls}`} {...p}>{children}</button>;
}
export function Input(p: any) { return <input className="ds-input" {...p} />; }
export function Select(p: any) { return <select className="ds-select" {...p} />; }
export function Card({ children, style }: any) { return <div className="ds-card" style={style}>{children}</div>; }
export function AnnouncementBar({ children }: any) {
  return <div style={{ background: "#2A1245", color: "#FFC531", textAlign: "center", padding: "8px 12px", fontWeight: 800, fontSize: 13 }}>{children}</div>;
}
export function Hero({ children }: any) { return <div className="ds-hero" style={{ padding: 28 }}>{children}</div>; }
export function ProductCard({ name, price, sizes, tag }: any) {
  return (
    <div className="ds-card">
      <div style={{ height: 170, borderRadius: 12, background: "linear-gradient(135deg,#FFE4EF,#FFE9D6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👗</div>
      <div style={{ marginTop: 10, fontWeight: 800 }}>{name} {tag && <span className="ds-badge ds-badge-hot">{tag}</span>}</div>
      <div style={{ color: "#E6007A", fontWeight: 800 }}>{price}</div>
      <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>{sizes.map((s: string) => <span key={s} className="ds-badge">{s}</span>)}</div>
    </div>
  );
}
export function SizeBadge({ children, hot }: any) { return <span className={`ds-badge ${hot ? "ds-badge-hot" : ""}`}>{children}</span>; }
export function FitMeter({ area, label }: { area: string; label: string }) {
  const cls = /good/i.test(label) ? "ds-fit-good" : /fitted|snug/i.test(label) ? "ds-fit-snug" : "ds-fit-loose";
  return <div><strong>{area}:</strong> <span className={cls}>● {label}</span></div>;
}
export function DisclaimerBanner({ children }: any) { return <div className="ds-banner" role="note">{children}</div>; }
export function TryOnViewer({ live }: { live: boolean }) {
  return (
    <div className="ds-card">
      <div>🔒 {live ? "Live preview — not stored. Only saves if you tap Save." : "Approved save (encrypted, deletable)."}</div>
      <div style={{ height: 170, borderRadius: 12, marginTop: 8, background: "linear-gradient(135deg,#2A1245,#E6007A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>✨ TRY-ON ✨</div>
    </div>
  );
}
