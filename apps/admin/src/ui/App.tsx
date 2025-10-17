import React from "react"

const gradientDark = "linear-gradient(135deg, #0E1116 0%, #111827 35%, #090C12 100%)"
const glass = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "20px",
  boxShadow: "0 18px 45px rgba(8,15,26,0.45)",
  backdropFilter: "blur(24px)",
}

function Card({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <div style={{ ...glass, padding: "20px", minWidth: "200px" }}>
      <div style={{ color: "#94a3b8", fontSize: "14px", letterSpacing: "0.05em" }}>{title}</div>
      <div style={{ marginTop: "8px", fontSize: "32px", fontWeight: 600, color: "#fff" }}>{value}</div>
      <div style={{ marginTop: "4px", fontSize: "12px", color: trend.includes("-") ? "#f87171" : "#34d399" }}>{trend}</div>
    </div>
  )
}

const cards = [
  { title: "Passengers in transit", value: "65", trend: "+12% vs yesterday" },
  { title: "Active vehicles", value: "4/5", trend: "Stable" },
  { title: "Routes today", value: "4", trend: "+3 vs plan" },
  { title: "Critical alerts", value: "1", trend: "1 action required" },
]

export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: gradientDark,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
        padding: "56px 32px",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <header style={{ width: "100%", maxWidth: "1120px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center", fontSize: "24px" }}>??</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#cbd5f5" }}>Golf Fox Admin</h1>
            <div style={{ fontSize: "14px", color: "#94a3b8" }}>Premium cockpit · realtime monitoring</div>
          </div>
        </div>
        <button
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
            color: "#e2e8f0",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Preferences ??
        </button>
      </header>

      <section style={{ width: "100%", maxWidth: "1120px", display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </section>

      <footer style={{ marginTop: "48px", color: "#94a3b8", fontSize: "12px" }}>
        Dashboard demonstrativo — conecte Supabase e Google Maps para desbloquear dados em tempo real.
      </footer>
    </main>
  )
}
