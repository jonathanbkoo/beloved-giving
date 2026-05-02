import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

// ── DATA ──────────────────────────────────────────────────────────────────────
const givingData = [
  { month: "Aug '25", recurring: 0,       oneTime: 15000.00 },
  { month: "Sep '25", recurring: 251.45,  oneTime: 1541.75  },
  { month: "Oct '25", recurring: 2111.20, oneTime: 6691.40  },
  { month: "Nov '25", recurring: 2865.35, oneTime: 5242.32  },
  { month: "Dec '25", recurring: 2271.20, oneTime: 45330.42 },
  { month: "Jan '26", recurring: 3801.60, oneTime: 5313.91  },
  { month: "Feb '26", recurring: 4801.60, oneTime: 9532.25  },
  { month: "Mar '26", recurring: 5792.60, oneTime: 9393.25  },
  { month: "Apr '26", recurring: 5740.10, oneTime: 8491.32  },
];

const giverData = [
  { month: "Aug '25", newGivers: 1,  active: 0  },
  { month: "Sep '25", newGivers: 11, active: 0  },
  { month: "Oct '25", newGivers: 11, active: 11 },
  { month: "Nov '25", newGivers: 11, active: 17 },
  { month: "Dec '25", newGivers: 11, active: 18 },
  { month: "Jan '26", newGivers: 8,  active: 25 },
  { month: "Feb '26", newGivers: 10, active: 32 },
  { month: "Mar '26", newGivers: 11, active: 36 },
  { month: "Apr '26", newGivers: 10, active: 31 },
];

const donationData = [
  { month: "Aug '25", recurring: 0,  oneTime: 1  },
  { month: "Sep '25", recurring: 1,  oneTime: 15 },
  { month: "Oct '25", recurring: 5,  oneTime: 50 },
  { month: "Nov '25", recurring: 6,  oneTime: 42 },
  { month: "Dec '25", recurring: 7,  oneTime: 44 },
  { month: "Jan '26", recurring: 13, oneTime: 43 },
  { month: "Feb '26", recurring: 19, oneTime: 59 },
  { month: "Mar '26", recurring: 30, oneTime: 68 },
  { month: "Apr '26", recurring: 32, oneTime: 48 },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmtDollar = (v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`;

const fmtDollarK = (v) => {
  if (v === 0) return "$0";
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
};

const pct = (curr, prev) => {
  if (prev === null || prev === undefined) return null;
  if (prev === 0) return curr > 0 ? "+∞" : "—";
  const v = ((curr - prev) / prev) * 100;
  return (v >= 0 ? "+" : "") + v.toFixed(1) + "%";
};

const Badge = ({ val }) => {
  if (!val || val === "—") return null;
  const isPos = val.startsWith("+");
  return (
    <span style={{
      display: "inline-block",
      background: isPos ? "rgba(22,163,74,0.18)" : "rgba(220,38,38,0.18)",
      color: isPos ? "#4ade80" : "#f87171",
      fontSize: 10, fontWeight: 700,
      padding: "1px 6px", borderRadius: 4,
      marginLeft: 6, fontFamily: "Calibri, sans-serif",
    }}>{val === "+∞" ? "New" : val}</span>
  );
};

// Custom top label for giving chart (renders above the stacked bar)
const GivingTopLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#0F1F3D"
      textAnchor="middle"
      fontSize={10}
      fontFamily="Calibri, sans-serif"
      fontWeight={700}
    >
      {fmtDollarK(value)}
    </text>
  );
};

// Custom top label for giver chart
const GiverTopLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#0F1F3D"
      textAnchor="middle"
      fontSize={10}
      fontFamily="Calibri, sans-serif"
      fontWeight={700}
    >
      {value}
    </text>
  );
};

// Custom top label for donation count chart
const DonationTopLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#0F1F3D"
      textAnchor="middle"
      fontSize={10}
      fontFamily="Calibri, sans-serif"
      fontWeight={700}
    >
      {value}
    </text>
  );
};

// ── TOOLTIPS ──────────────────────────────────────────────────────────────────
const GivingTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const recurring = payload.find(p => p.dataKey === "recurring")?.value ?? 0;
  const oneTime   = payload.find(p => p.dataKey === "oneTime")?.value ?? 0;
  const total     = recurring + oneTime;
  const idx       = givingData.findIndex(d => d.month === label);
  const prev      = idx > 0 ? givingData[idx - 1] : null;
  const prevTotal = prev ? prev.recurring + prev.oneTime : null;

  const Row = ({ label: rl, value, prevVal, color }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
        <span style={{ color: "#94A3B8", fontSize: 11, fontFamily: "Calibri, sans-serif" }}>{rl}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Georgia, serif" }}>
          ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <Badge val={pct(value, prevVal)} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0F1F3D", border: "1px solid #C49A3C", borderRadius: 10, padding: "12px 16px", minWidth: 260, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
      <div style={{ marginBottom: 8 }}>
        <p style={{ color: "#E8C472", fontWeight: 700, margin: 0, fontSize: 14, fontFamily: "Georgia, serif" }}>{label}</p>
        {prev && <p style={{ color: "#64748B", fontSize: 10, margin: "2px 0 0", fontFamily: "Calibri, sans-serif" }}>vs. {prev.month}</p>}
      </div>
      <Row label="Recurring" value={recurring} prevVal={prev?.recurring} color="#1A3260" />
      <Row label="One-Time"  value={oneTime}   prevVal={prev?.oneTime}   color="#C49A3C" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
        <span style={{ color: "#E8C472", fontSize: 11, fontWeight: 700, fontFamily: "Calibri, sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>Total</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {prev && <Badge val={pct(total, prevTotal)} />}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ height: 6, borderRadius: 3, background: "#1E3A6E", overflow: "hidden", display: "flex" }}>
          {total > 0 && <>
            <div style={{ width: `${(recurring / total) * 100}%`, background: "#1A3260" }} />
            <div style={{ width: `${(oneTime / total) * 100}%`, background: "#C49A3C" }} />
          </>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ color: "#64748B", fontSize: 9, fontFamily: "Calibri, sans-serif" }}>Recurring {total > 0 ? ((recurring / total) * 100).toFixed(0) : 0}%</span>
          <span style={{ color: "#C49A3C", fontSize: 9, fontFamily: "Calibri, sans-serif" }}>One-Time {total > 0 ? ((oneTime / total) * 100).toFixed(0) : 0}%</span>
        </div>
      </div>
    </div>
  );
};

const GiverTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const newG    = payload.find(p => p.dataKey === "newGivers")?.value ?? 0;
  const activeG = payload.find(p => p.dataKey === "active")?.value ?? 0;
  const total   = newG + activeG;
  const idx     = giverData.findIndex(d => d.month === label);
  const prev    = idx > 0 ? giverData[idx - 1] : null;
  const prevTotal = prev ? prev.newGivers + prev.active : null;

  const Row = ({ label: rl, value, prevVal, color }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
        <span style={{ color: "#94A3B8", fontSize: 11, fontFamily: "Calibri, sans-serif" }}>{rl}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Georgia, serif" }}>{value}</span>
        <Badge val={pct(value, prevVal)} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0F1F3D", border: "1px solid #C49A3C", borderRadius: 10, padding: "12px 16px", minWidth: 240, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
      <div style={{ marginBottom: 8 }}>
        <p style={{ color: "#E8C472", fontWeight: 700, margin: 0, fontSize: 14, fontFamily: "Georgia, serif" }}>{label}</p>
        {prev && <p style={{ color: "#64748B", fontSize: 10, margin: "2px 0 0", fontFamily: "Calibri, sans-serif" }}>vs. {prev.month}</p>}
      </div>
      <Row label="Active Givers" value={activeG} prevVal={prev?.active}   color="#028090" />
      <Row label="New Givers"    value={newG}    prevVal={prev?.newGivers} color="#C49A3C" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
        <span style={{ color: "#E8C472", fontSize: 11, fontWeight: 700, fontFamily: "Calibri, sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>Total Unique</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>{total}</span>
          {prev && <Badge val={pct(total, prevTotal)} />}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ height: 6, borderRadius: 3, background: "#1E3A6E", overflow: "hidden", display: "flex" }}>
          {total > 0 && <>
            <div style={{ width: `${(activeG / total) * 100}%`, background: "#028090" }} />
            <div style={{ width: `${(newG / total) * 100}%`, background: "#C49A3C" }} />
          </>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ color: "#028090", fontSize: 9, fontFamily: "Calibri, sans-serif" }}>Active {total > 0 ? ((activeG / total) * 100).toFixed(0) : 0}%</span>
          <span style={{ color: "#C49A3C", fontSize: 9, fontFamily: "Calibri, sans-serif" }}>New {total > 0 ? ((newG / total) * 100).toFixed(0) : 0}%</span>
        </div>
      </div>
    </div>
  );
};

const DonationTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const recurring = payload.find(p => p.dataKey === "recurring")?.value ?? 0;
  const oneTime   = payload.find(p => p.dataKey === "oneTime")?.value ?? 0;
  const total     = recurring + oneTime;
  const idx       = donationData.findIndex(d => d.month === label);
  const prev      = idx > 0 ? donationData[idx - 1] : null;
  const prevTotal = prev ? prev.recurring + prev.oneTime : null;

  const Row = ({ label: rl, value, prevVal, color }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
        <span style={{ color: "#94A3B8", fontSize: 11, fontFamily: "Calibri, sans-serif" }}>{rl}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Georgia, serif" }}>{value}</span>
        <Badge val={pct(value, prevVal)} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0F1F3D", border: "1px solid #C49A3C", borderRadius: 10, padding: "12px 16px", minWidth: 240, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
      <div style={{ marginBottom: 8 }}>
        <p style={{ color: "#E8C472", fontWeight: 700, margin: 0, fontSize: 14, fontFamily: "Georgia, serif" }}>{label}</p>
        {prev && <p style={{ color: "#64748B", fontSize: 10, margin: "2px 0 0", fontFamily: "Calibri, sans-serif" }}>vs. {prev.month}</p>}
      </div>
      <Row label="Recurring" value={recurring} prevVal={prev?.recurring} color="#0F1F3D" />
      <Row label="One-Time"  value={oneTime}   prevVal={prev?.oneTime}   color="#C49A3C" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
        <span style={{ color: "#E8C472", fontSize: 11, fontWeight: 700, fontFamily: "Calibri, sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>Total</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif" }}>{total}</span>
          {prev && <Badge val={pct(total, prevTotal)} />}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ height: 6, borderRadius: 3, background: "#1E3A6E", overflow: "hidden", display: "flex" }}>
          {total > 0 && <>
            <div style={{ width: `\${(recurring / total) * 100}%`, background: "#0F1F3D" }} />
            <div style={{ width: `\${(oneTime / total) * 100}%`, background: "#C49A3C" }} />
          </>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ color: "#64748B", fontSize: 9, fontFamily: "Calibri, sans-serif" }}>Recurring {total > 0 ? ((recurring / total) * 100).toFixed(0) : 0}%</span>
          <span style={{ color: "#C49A3C", fontSize: 9, fontFamily: "Calibri, sans-serif" }}>One-Time {total > 0 ? ((oneTime / total) * 100).toFixed(0) : 0}%</span>
        </div>
      </div>
    </div>
  );
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div style={{ width: "100%", maxWidth: 820, marginBottom: 16 }}>
    <p style={{ color: "#C49A3C", fontSize: 11, fontFamily: "Calibri, sans-serif", fontWeight: 700, letterSpacing: 3, margin: "0 0 4px", textTransform: "uppercase" }}>{eyebrow}</p>
    <h2 style={{ color: "#0F1F3D", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{title}</h2>
    <p style={{ color: "#64748B", fontSize: 13, fontFamily: "Calibri, sans-serif", margin: 0 }}>{subtitle}</p>
  </div>
);

const fmtKpi = (value) => {
  const n = Number(value);
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

const KpiCard = ({ label, value, note, accent, isCount }) => (
  <div style={{ background: "#fff", borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: `3px solid ${accent}`, minWidth: 0 }}>
    <p style={{ color: "#64748B", fontSize: 9.5, fontFamily: "Calibri, sans-serif", fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</p>
    <p style={{ color: "#0F1F3D", fontSize: 20, fontWeight: 700, margin: "0 0 3px", fontFamily: "Georgia, serif", whiteSpace: "nowrap" }}>
      {isCount ? value : fmtKpi(value)}
    </p>
    <p style={{ color: "#94A3B8", fontSize: 9.5, fontFamily: "Calibri, sans-serif", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Avg of {note}</p>
  </div>
);

const Divider = () => (
  <div style={{ width: "100%", maxWidth: 820, height: 1, background: "#E2E8F0", margin: "40px 0 32px" }} />
);

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function GivingDashboard() {
  const lastIdx = givingData.length - 1;
  const r3Label = `${givingData[lastIdx - 2].month} – ${givingData[lastIdx].month}`;

  const r3Recurring = (givingData[lastIdx-2].recurring + givingData[lastIdx-1].recurring + givingData[lastIdx].recurring) / 3;
  const r3OneTime   = (givingData[lastIdx-2].oneTime   + givingData[lastIdx-1].oneTime   + givingData[lastIdx].oneTime)   / 3;
  const r3Total     = r3Recurring + r3OneTime;

  const r3New    = (giverData[lastIdx-2].newGivers + giverData[lastIdx-1].newGivers + giverData[lastIdx].newGivers) / 3;
  const r3Active = (giverData[lastIdx-2].active    + giverData[lastIdx-1].active    + giverData[lastIdx].active)    / 3;
  const r3TotalG = r3New + r3Active;

  const r3DonRecurring = (donationData[lastIdx-2].recurring + donationData[lastIdx-1].recurring + donationData[lastIdx].recurring) / 3;
  const r3DonOneTime   = (donationData[lastIdx-2].oneTime   + donationData[lastIdx-1].oneTime   + donationData[lastIdx].oneTime)   / 3;
  const r3DonTotal     = r3DonRecurring + r3DonOneTime;

  // Compute total per month for giving top labels
  const givingWithTotal = givingData.map(d => ({ ...d, total: d.recurring + d.oneTime }));
  const giverWithTotal  = giverData.map(d => ({ ...d, total: d.newGivers + d.active }));

  return (
    <div style={{ background: "#F7F8FA", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px 48px", fontFamily: "Georgia, serif" }}>

      {/* PAGE HEADER */}
      <div style={{ width: "100%", maxWidth: 820, marginBottom: 36 }}>
        <p style={{ color: "#C49A3C", fontSize: 11, fontFamily: "Calibri, sans-serif", fontWeight: 700, letterSpacing: 3, margin: "0 0 6px", textTransform: "uppercase" }}>
          Beloved New York · Overflow Platform
        </p>
        <h1 style={{ color: "#0F1F3D", fontSize: 30, fontWeight: 700, margin: "0 0 6px" }}>Giving Dashboard</h1>
        <p style={{ color: "#64748B", fontSize: 13, fontFamily: "Calibri, sans-serif", margin: 0 }}>
          Aug 2025 – Apr 2026 · 84 unique donors · 485 transactions
        </p>
      </div>

      {/* ── SECTION 1: GIVING ── */}
      <SectionHeader eyebrow="Section 1" title="Monthly Giving" subtitle="Recurring vs. One-Time contributions" />
      <div style={{ width: "100%", maxWidth: 820, background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "28px 16px 16px" }}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={givingWithTotal} margin={{ top: 24, right: 20, left: 10, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Calibri, sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtDollar} tick={{ fill: "#64748B", fontSize: 11, fontFamily: "Calibri, sans-serif" }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<GivingTooltip />} cursor={{ fill: "rgba(15,31,61,0.04)" }} />
            <Legend wrapperStyle={{ fontFamily: "Calibri, sans-serif", fontSize: 12, paddingTop: 12 }} formatter={(v) => <span style={{ color: "#475569" }}>{v}</span>} />
            <Bar dataKey="recurring" name="Recurring" stackId="a" fill="#0F1F3D" radius={[0,0,0,0]} />
            <Bar dataKey="oneTime" name="One-Time" stackId="a" fill="#C49A3C" radius={[4,4,0,0]}>
              <LabelList dataKey="total" content={<GivingTopLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: "100%", maxWidth: 820, marginTop: 8 }}>
        <p style={{ color: "#64748B", fontSize: 10, fontFamily: "Calibri, sans-serif", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "12px 0 8px" }}>
          Rolling 3-Month Average (Feb – Apr '26)
        </p>
      </div>
      <div style={{ width: "100%", maxWidth: 820, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <KpiCard label="3-Mo Avg · Total Giving" value={r3Total}     note={r3Label} accent="#0F1F3D" />
        <KpiCard label="3-Mo Avg · Recurring"    value={r3Recurring} note={r3Label} accent="#1A3260" />
        <KpiCard label="3-Mo Avg · One-Time"     value={r3OneTime}   note={r3Label} accent="#C49A3C" />
      </div>

      <Divider />

      {/* ── SECTION 2: GIVERS ── */}
      <SectionHeader eyebrow="Section 2" title="Monthly Unique Givers" subtitle="New (first gift ever this month) vs. Active (gave in a prior month) · 84 total donors on file" />
      <div style={{ width: "100%", maxWidth: 820, background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "28px 16px 16px" }}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={giverWithTotal} margin={{ top: 24, right: 20, left: 10, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Calibri, sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11, fontFamily: "Calibri, sans-serif" }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
            <Tooltip content={<GiverTooltip />} cursor={{ fill: "rgba(15,31,61,0.04)" }} />
            <Legend wrapperStyle={{ fontFamily: "Calibri, sans-serif", fontSize: 12, paddingTop: 12 }} formatter={(v) => <span style={{ color: "#475569" }}>{v === "newGivers" ? "New Givers" : "Active Givers"}</span>} />
            <Bar dataKey="active"    name="active"    stackId="b" fill="#028090" radius={[0,0,0,0]} />
            <Bar dataKey="newGivers" name="newGivers" stackId="b" fill="#C49A3C" radius={[4,4,0,0]}>
              <LabelList dataKey="total" content={<GiverTopLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: "100%", maxWidth: 820, marginTop: 8 }}>
        <p style={{ color: "#64748B", fontSize: 10, fontFamily: "Calibri, sans-serif", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "12px 0 8px" }}>
          Rolling 3-Month Average (Feb – Apr '26)
        </p>
      </div>
      <div style={{ width: "100%", maxWidth: 820, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <KpiCard label="3-Mo Avg · Total Unique Givers" value={r3TotalG.toFixed(1)} note={r3Label} accent="#0F1F3D" isCount />
        <KpiCard label="3-Mo Avg · Active Givers"       value={r3Active.toFixed(1)} note={r3Label} accent="#028090" isCount />
        <KpiCard label="3-Mo Avg · New Givers"          value={r3New.toFixed(1)}    note={r3Label} accent="#C49A3C" isCount />
      </div>

      <Divider />

      {/* ── SECTION 3: DONATION COUNT ── */}
      <SectionHeader eyebrow="Section 3" title="Total Donations per Month" subtitle="Total number of individual transactions · excludes canceled" />
      <div style={{ width: "100%", maxWidth: 820, background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "28px 16px 16px" }}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={donationData.map(d => ({ ...d, total: d.recurring + d.oneTime }))} margin={{ top: 24, right: 20, left: 10, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 12, fontFamily: "Calibri, sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11, fontFamily: "Calibri, sans-serif" }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
            <Tooltip content={<DonationTooltip />} cursor={{ fill: "rgba(15,31,61,0.04)" }} />
            <Legend wrapperStyle={{ fontFamily: "Calibri, sans-serif", fontSize: 12, paddingTop: 12 }} formatter={(v) => <span style={{ color: "#475569" }}>{v === "recurring" ? "Recurring" : "One-Time"}</span>} />
            <Bar dataKey="recurring" name="recurring" stackId="c" fill="#0F1F3D" radius={[0,0,0,0]} />
            <Bar dataKey="oneTime"   name="oneTime"   stackId="c" fill="#C49A3C" radius={[4,4,0,0]}>
              <LabelList dataKey="total" content={<DonationTopLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: "100%", maxWidth: 820, marginTop: 8 }}>
        <p style={{ color: "#64748B", fontSize: 10, fontFamily: "Calibri, sans-serif", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "12px 0 8px" }}>
          Rolling 3-Month Average (Feb – Apr '26)
        </p>
      </div>
      <div style={{ width: "100%", maxWidth: 820, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <KpiCard label="3-Mo Avg · Total Donations"     value={r3DonTotal.toFixed(1)}     note={r3Label} accent="#0F1F3D" isCount />
        <KpiCard label="3-Mo Avg · Recurring Donations" value={r3DonRecurring.toFixed(1)} note={r3Label} accent="#1A3260" isCount />
        <KpiCard label="3-Mo Avg · One-Time Donations"  value={r3DonOneTime.toFixed(1)}   note={r3Label} accent="#C49A3C" isCount />
      </div>

    </div>
  );
}
