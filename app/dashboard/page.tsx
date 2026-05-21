import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../utils/supabase/server";
import { createAdminClient } from "../utils/supabase/server";
import { getBalance } from "../utils/credits";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = await createAdminClient();

  const [
    standardBalance,
    hdBalance,
    { data: profile },
    { data: generations },
  ] = await Promise.all([
    getBalance(user.id, "STANDARD"),
    getBalance(user.id, "HD"),
    admin.from("saas_profiles").select("plan, created_at").eq("id", user.id).single(),
    admin
      .from("saas_generations")
      .select("id, type, input_image_url, output_image_url, colour_hex, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const plan = profile?.plan || "free";

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>Dashboard</h1>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>{user.email}</p>
          </div>
          <Link href="/generate" style={{ padding: "11px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "#fff", fontWeight: 700, fontSize: "14px" }}>
            ✨ New generation
          </Link>
        </div>

        {/* Credit cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "28px" }}>
          <CreditCard
            icon="⚡" label="Standard credits" balance={standardBalance}
            colour="#3b82f6" unlimited={plan === "business"}
          />
          <CreditCard
            icon="✨" label="HD credits" balance={hdBalance}
            colour="#8b5cf6" unlimited={false}
          />
          <div style={{ padding: "20px", borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.12)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Current plan</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", textTransform: "capitalize", marginBottom: "10px" }}>{plan}</div>
            <Link href="/pricing" style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 600 }}>
              {plan === "free" ? "Upgrade →" : "Manage plan →"}
            </Link>
          </div>
        </div>

        {/* Top-up prompt if low */}
        {(standardBalance < 2 || hdBalance < 1) && (
          <div style={{ marginBottom: "24px", padding: "16px 20px", borderRadius: "12px", background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "14px" }}>
              ⚠️ You&apos;re running low on credits
            </div>
            <Link href="/pricing" style={{ padding: "8px 16px", borderRadius: "8px", background: "#fbbf24", color: "#000", fontWeight: 700, fontSize: "13px" }}>
              Top up credits
            </Link>
          </div>
        )}

        {/* Generation history */}
        <div style={{ borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.12)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#e2e8f0" }}>Recent generations</h2>
          </div>

          {!generations?.length ? (
            <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎨</div>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>No generations yet — <Link href="/generate" style={{ color: "#60a5fa" }}>create your first one</Link></p>
            </div>
          ) : (
            <div>
              {generations.map((gen, i) => (
                <div
                  key={gen.id}
                  style={{
                    display: "flex", gap: "14px", alignItems: "center",
                    padding: "14px 20px",
                    borderBottom: i < generations.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  {/* Thumbnails */}
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <img src={gen.input_image_url} alt="input" style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "7px", border: "1px solid #1e293b" }} />
                    {gen.output_image_url && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", color: "#334155", fontSize: "12px" }}>→</div>
                        <img src={gen.output_image_url} alt="output" style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "7px", border: "1px solid #1e293b" }} />
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      {gen.colour_hex && (
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: gen.colour_hex, border: "1px solid #1e293b", flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>
                        {gen.colour_hex || "—"}
                      </span>
                      <span style={{
                        fontSize: "11px", fontWeight: 700, padding: "2px 7px", borderRadius: "999px",
                        background: gen.type === "HD" ? "rgba(139,92,246,0.15)" : "rgba(59,130,246,0.12)",
                        color: gen.type === "HD" ? "#a78bfa" : "#60a5fa",
                        border: gen.type === "HD" ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(59,130,246,0.2)",
                      }}>
                        {gen.type === "HD" ? "✨ HD" : "⚡ Standard"}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#475569" }}>
                      {new Date(gen.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {/* Download */}
                  {gen.output_image_url && gen.status === "done" && (
                    <a
                      href={gen.output_image_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: "7px 12px", borderRadius: "8px", background: "#111827", border: "1px solid #1e293b", color: "#94a3b8", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}
                    >
                      ⬇ Download
                    </a>
                  )}
                  {gen.status === "processing" && (
                    <span style={{ fontSize: "12px", color: "#64748b", flexShrink: 0 }}>Processing…</span>
                  )}
                  {gen.status === "failed" && (
                    <span style={{ fontSize: "12px", color: "#f87171", flexShrink: 0 }}>Failed</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreditCard({ icon, label, balance, colour, unlimited }: {
  icon: string; label: string; balance: number; colour: string; unlimited: boolean;
}) {
  return (
    <div style={{ padding: "20px", borderRadius: "14px", background: "#0d1424", border: `1px solid ${colour}22` }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: "36px", fontWeight: 800, color: unlimited ? colour : balance > 0 ? colour : "#ef4444" }}>
        {unlimited ? "∞" : balance}
      </div>
      <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
        {unlimited ? "Unlimited" : balance === 1 ? "1 credit remaining" : `${balance} credits remaining`}
      </div>
    </div>
  );
}
