import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "../utils/supabase/server";
import { getBalance } from "../utils/credits";
import AccountForm from "../components/AccountForm";

export const dynamic = "force-dynamic";

// Subscriptions are billed through Gumroad; customers manage them from their
// Gumroad library (the same place their receipts/manage links live).
const GUMROAD_MANAGE_URL = "https://app.gumroad.com/library";

type Tab = "overview" | "purchases" | "account" | "subscription";
const TABS: Tab[] = ["overview", "purchases", "account", "subscription"];
const TAB_LABELS: Record<Tab, string> = {
  overview:     "Overview",
  purchases:    "Purchase history",
  account:      "Account settings",
  subscription: "Subscription",
};
const TAB_ICONS: Record<Tab, string> = {
  overview:     "🏠",
  purchases:    "🧾",
  account:      "⚙️",
  subscription: "💳",
};

const REASON_LABELS: Record<string, string> = {
  signup_bonus: "Signup bonus",
  subscription: "Subscription renewal",
  pack_purchase: "Credit pack",
  admin_topup:   "Admin credit",
};

const PLAN_FEATURES: Record<string, string[]> = {
  free:     ["5 Standard credits", "Signup bonus only"],
  starter:  ["100 Standard / month", "Credits refresh monthly"],
  pro:      ["500 Standard / month", "Up to 20 colours/gen", "Priority support"],
  business: ["∞ Unlimited Standard", "Up to 20 colours/gen", "Priority support"],
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tab } = await searchParams;
  const activeTab: Tab = TABS.includes(tab as Tab) ? (tab as Tab) : "overview";

  const admin = await createAdminClient();

  // Always fetch credits + profile
  const [standardBalance, { data: profile }] = await Promise.all([
    getBalance(user.id, "STANDARD"),
    admin.from("saas_profiles")
      .select("plan, created_at, marketing_consent")
      .eq("id", user.id)
      .single(),
  ]);

  // Tab-specific data
  let generations: {
    id: string; type: string; input_image_url: string;
    output_image_url: string | null; colour_hex: string | null;
    status: string; created_at: string;
  }[] | null = null;

  let ledger: {
    type: string; delta: number; reason: string; created_at: string;
  }[] | null = null;

  if (activeTab === "overview") {
    const { data } = await admin
      .from("saas_generations")
      .select("id, type, input_image_url, output_image_url, colour_hex, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    generations = data;
  }

  if (activeTab === "purchases") {
    const { data } = await admin
      .from("saas_credit_ledger")
      .select("type, delta, reason, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    ledger = data;
  }

  const plan         = profile?.plan || "free";
  const displayName  = (user.user_metadata?.display_name as string) || "";
  const marketing    = profile?.marketing_consent ?? false;
  const memberSince  = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const isPaidPlan   = plan !== "free";

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "960px" }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 3px" }}>
              {displayName ? `Hi, ${displayName}` : "Dashboard"}
            </h1>
            <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>{user.email}</p>
          </div>
          <Link href="/generate" style={{
            padding: "10px 20px", borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
            color: "#fff", fontWeight: 700, fontSize: "14px",
          }}>
            ✨ New generation
          </Link>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display: "flex", gap: "4px", marginBottom: "28px",
          padding: "4px", background: "#0b1120",
          border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px",
          overflowX: "auto",
        }}>
          {TABS.map((t) => (
            <Link key={t} href={`/dashboard?tab=${t}`} style={{
              flex: "0 0 auto", padding: "10px 18px", borderRadius: "10px",
              fontSize: "13px", fontWeight: 700, textDecoration: "none",
              background: activeTab === t ? "#111827" : "transparent",
              color: activeTab === t ? "#e2e8f0" : "#475569",
              boxShadow: activeTab === t ? "0 1px 6px rgba(0,0,0,0.4)" : "none",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}>
              {TAB_ICONS[t]} {TAB_LABELS[t]}
            </Link>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            TAB: OVERVIEW
        ══════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Credit cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px" }}>
              <CreditCard icon="⚡" label="Standard credits" balance={standardBalance} colour="#3b82f6" unlimited={plan === "business"} />
              <div style={{ padding: "20px", borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.12)" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Current plan</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", textTransform: "capitalize", marginBottom: "10px" }}>{plan}</div>
                <Link href="/dashboard?tab=subscription" style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 600 }}>
                  {plan === "free" ? "Upgrade →" : "Manage →"}
                </Link>
              </div>
            </div>

            {/* Low-credits warning */}
            {standardBalance < 2 && (
              <div style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: "14px" }}>⚠️ Running low on credits</span>
                <Link href="/pricing" style={{ padding: "7px 14px", borderRadius: "8px", background: "#fbbf24", color: "#000", fontWeight: 700, fontSize: "13px" }}>
                  Top up →
                </Link>
              </div>
            )}

            {/* Recent generations */}
            <div style={{ borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.12)", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#e2e8f0" }}>Recent generations</h2>
                <Link href="/generate" style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 600 }}>+ New →</Link>
              </div>

              {!generations?.length ? (
                <div style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎨</div>
                  <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                    No generations yet — <Link href="/generate" style={{ color: "#60a5fa" }}>create your first</Link>
                  </p>
                </div>
              ) : (
                <div>
                  {generations.map((gen, i) => (
                    <div key={gen.id} style={{
                      display: "flex", gap: "14px", alignItems: "center", padding: "14px 20px",
                      borderBottom: i < generations.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={gen.input_image_url} alt="input" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "7px", border: "1px solid #1e293b" }} />
                        {gen.output_image_url && (
                          <>
                            <div style={{ display: "flex", alignItems: "center", color: "#334155", fontSize: "12px" }}>→</div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={gen.output_image_url} alt="output" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "7px", border: "1px solid #1e293b" }} />
                          </>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                          {gen.colour_hex && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: gen.colour_hex, border: "1px solid #1e293b", flexShrink: 0 }} />}
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>{gen.colour_hex || "—"}</span>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "999px", background: gen.type === "HD" ? "rgba(139,92,246,0.15)" : "rgba(59,130,246,0.12)", color: gen.type === "HD" ? "#a78bfa" : "#60a5fa", border: gen.type === "HD" ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(59,130,246,0.2)" }}>
                            {gen.type === "HD" ? "✨ HD" : "⚡ Std"}
                          </span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#475569" }}>
                          {new Date(gen.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      {gen.output_image_url && gen.status === "done" && (
                        <a href={gen.output_image_url} download target="_blank" rel="noopener noreferrer"
                          style={{ padding: "7px 12px", borderRadius: "8px", background: "#111827", border: "1px solid #1e293b", color: "#94a3b8", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                          ⬇ Download
                        </a>
                      )}
                      {gen.status === "processing" && <span style={{ fontSize: "12px", color: "#64748b", flexShrink: 0 }}>Processing…</span>}
                      {gen.status === "failed"     && <span style={{ fontSize: "12px", color: "#f87171", flexShrink: 0 }}>Failed</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB: PURCHASE HISTORY
        ══════════════════════════════════════════════ */}
        {activeTab === "purchases" && (
          <div style={{ borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.12)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#e2e8f0" }}>Credit history</h2>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#475569" }}>All credit transactions on your account</p>
            </div>

            {!ledger?.length ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🧾</div>
                <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>No transactions yet.</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px 100px", padding: "10px 20px", gap: "12px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Description", "Date", "Type", "Credits"].map(h => (
                    <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
                  ))}
                </div>

                {ledger.map((row, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1fr 120px 80px 100px",
                    padding: "13px 20px", gap: "12px", alignItems: "center",
                    borderBottom: i < ledger.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  }}>
                    <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 600 }}>
                      {REASON_LABELS[row.reason] ?? row.reason}
                    </div>
                    <div style={{ fontSize: "12px", color: "#475569" }}>
                      {new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div>
                      <span style={{
                        fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                        background: row.type === "HD" ? "rgba(139,92,246,0.12)" : "rgba(59,130,246,0.12)",
                        color: row.type === "HD" ? "#a78bfa" : "#60a5fa",
                        border: row.type === "HD" ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(59,130,246,0.2)",
                      }}>
                        {row.type === "HD" ? "✨ HD" : "⚡ Std"}
                      </span>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: row.delta > 0 ? "#10b981" : "#f87171" }}>
                      {row.delta > 0 ? `+${row.delta}` : row.delta}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB: ACCOUNT SETTINGS
        ══════════════════════════════════════════════ */}
        {activeTab === "account" && (
          <div style={{ borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.12)", padding: "28px 32px" }}>
            <AccountForm
              initialDisplayName={displayName}
              initialMarketing={marketing}
              email={user.email ?? ""}
              memberSince={memberSince}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB: SUBSCRIPTION
        ══════════════════════════════════════════════ */}
        {activeTab === "subscription" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Current plan card */}
            <div style={{ borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.12)", padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>Current plan</div>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: "#fff", textTransform: "capitalize" }}>{plan}</div>
                </div>
                {isPaidPlan ? (
                  <a href={GUMROAD_MANAGE_URL} target="_blank" rel="noopener noreferrer" style={{
                    padding: "10px 20px", borderRadius: "10px",
                    background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
                    color: "#60a5fa", fontWeight: 700, fontSize: "14px",
                  }}>
                    Manage subscription →
                  </a>
                ) : (
                  <Link href="/pricing" style={{
                    padding: "10px 20px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                    color: "#fff", fontWeight: 700, fontSize: "14px",
                  }}>
                    Upgrade plan →
                  </Link>
                )}
              </div>

              {/* Plan features */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(PLAN_FEATURES[plan] ?? PLAN_FEATURES.free).map(f => (
                  <div key={f} style={{ fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
                    ✓ {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Credits summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}>
              <CreditCard icon="⚡" label="Standard credits" balance={standardBalance} colour="#3b82f6" unlimited={plan === "business"} />
            </div>

            {/* Paid plan: manage info */}
            {isPaidPlan && (
              <div style={{ padding: "18px 22px", borderRadius: "12px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#60a5fa", marginBottom: "6px" }}>Managing your subscription</div>
                <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px", lineHeight: 1.7 }}>
                  Billing is handled by Gumroad. To cancel, update payment details, or download invoices, visit your Gumroad library or check your purchase confirmation email.
                </p>
                <a href="https://gumroad.com/library" target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 600 }}>
                  Open Gumroad library →
                </a>
              </div>
            )}

            {/* Free plan: upgrade prompt */}
            {!isPaidPlan && (
              <div style={{ padding: "22px 24px", borderRadius: "12px", background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#a78bfa", marginBottom: "8px" }}>Upgrade for more credits</div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px", lineHeight: 1.7 }}>
                  Starter from $9/month — 100 standard credits, refreshed each billing cycle.
                </p>
                <Link href="/pricing" style={{
                  display: "inline-block", padding: "10px 22px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff", fontWeight: 700, fontSize: "14px",
                }}>
                  See all plans →
                </Link>
              </div>
            )}

            {/* Top-up packs */}
            <div style={{ padding: "18px 22px", borderRadius: "12px", background: "#0d1424", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", marginBottom: "4px" }}>Need a one-time top-up?</div>
              <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px" }}>Buy a credit pack without changing your plan.</p>
              <Link href="/pricing#packs" style={{ fontSize: "13px", color: "#60a5fa", fontWeight: 600 }}>
                Browse credit packs →
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function CreditCard({ icon, label, balance, colour, unlimited }: {
  icon: string; label: string; balance: number; colour: string; unlimited: boolean;
}) {
  return (
    <div style={{ padding: "20px", borderRadius: "14px", background: "#0d1424", border: `1px solid ${colour}22` }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: "34px", fontWeight: 800, color: unlimited ? colour : balance > 0 ? colour : "#ef4444" }}>
        {unlimited ? "∞" : balance}
      </div>
      <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
        {unlimited ? "Unlimited" : balance === 1 ? "1 credit remaining" : `${balance} credits remaining`}
      </div>
    </div>
  );
}
