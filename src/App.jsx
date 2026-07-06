import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
         ResponsiveContainer, LabelList, LineChart, Line } from "recharts";

// ── GIVING DATA ───────────────────────────────────────────────────────────────
const givingData = [
  { month: "Aug '25", recurring: 0,       oneTime: 15000.00, avg: 15000.00, median: 15000.00, sundays: 5, fullSundays: 5, sundayNote: null },
  { month: "Sep '25", recurring: 251.45,  oneTime: 1541.75,  avg: 112.08,   median: 50.73,    sundays: 4, fullSundays: 4, sundayNote: null },
  { month: "Oct '25", recurring: 2111.20, oneTime: 6691.40,  avg: 160.05,   median: 60.00,    sundays: 4, fullSundays: 4, sundayNote: null },
  { month: "Nov '25", recurring: 2865.35, oneTime: 5242.32,  avg: 168.91,   median: 75.00,    sundays: 5, fullSundays: 3, sundayNote: "11/2 no service · 11/30 no service" },
  { month: "Dec '25", recurring: 2271.20, oneTime: 45330.42, avg: 933.37,   median: 100.00,   sundays: 4, fullSundays: 4, sundayNote: null },
  { month: "Jan '26", recurring: 3801.60, oneTime: 5313.91,  avg: 162.78,   median: 90.00,    sundays: 4, fullSundays: 3, sundayNote: "1/25 Zoom only (not in-person)" },
  { month: "Feb '26", recurring: 4801.60, oneTime: 9532.25,  avg: 183.77,   median: 100.00,   sundays: 4, fullSundays: 4, sundayNote: null },
  { month: "Mar '26", recurring: 5792.60, oneTime: 9393.25,  avg: 154.96,   median: 51.45,    sundays: 5, fullSundays: 4, sundayNote: "3/22 launch team only" },
  { month: "Apr '26", recurring: 5740.10, oneTime: 8491.32,  avg: 177.89,   median: 65.72,    sundays: 4, fullSundays: 3, sundayNote: "4/12 launch team only" },
  { month: "May '26", recurring: 8207.20, oneTime: 7534.75,  avg: 167.47,   median: 80.00,    sundays: 5, fullSundays: 4, sundayNote: "5/31 launch team only" },
  { month: "Jun '26", recurring: 6212.70, oneTime: 6210.33,  avg: 153.37,   median: 60.00,    sundays: 4, fullSundays: 3, sundayNote: "6/28 launch team only" },
];

const giverData = [
  { month: "Aug '25", newGivers: 1,  active: 0  },
  { month: "Sep '25", newGivers: 11, active: 0  },
  { month: "Oct '25", newGivers: 11, active: 11 },
  { month: "Nov '25", newGivers: 11, active: 17 },
  { month: "Dec '25", newGivers: 11, active: 17 },
  { month: "Jan '26", newGivers: 8,  active: 25 },
  { month: "Feb '26", newGivers: 10, active: 32 },
  { month: "Mar '26", newGivers: 11, active: 36 },
  { month: "Apr '26", newGivers: 10, active: 31 },
  { month: "May '26", newGivers: 5,  active: 38 },
  { month: "Jun '26", newGivers: 8,  active: 34 },
];

const donationData = [
  { month: "Aug '25", recurring: 0,  oneTime: 1  },
  { month: "Sep '25", recurring: 1,  oneTime: 15 },
  { month: "Oct '25", recurring: 7,  oneTime: 48 },
  { month: "Nov '25", recurring: 9,  oneTime: 39 },
  { month: "Dec '25", recurring: 9,  oneTime: 42 },
  { month: "Jan '26", recurring: 17, oneTime: 39 },
  { month: "Feb '26", recurring: 23, oneTime: 55 },
  { month: "Mar '26", recurring: 35, oneTime: 63 },
  { month: "Apr '26", recurring: 36, oneTime: 44 },
  { month: "May '26", recurring: 48, oneTime: 46 },
  { month: "Jun '26", recurring: 34, oneTime: 48 },
];

// Pre-computed analytical insights per month
const insights = [
  { month: "Aug '25", driver: "Outlier", note: "Single $15K founding gift. Not representative of baseline giving — exclude from trend analysis." },
  { month: "Sep '25", driver: "Launch Month", note: "Church launches. 11 first-time givers, no recurring base yet. 4 full services. Low total expected and appropriate for a soft launch month." },
  { month: "Oct '25", driver: "Retention", note: "Sep givers return + 11 new givers. Recurring giving begins at $2.1K. 4 full services. +391% MoM driven entirely by retention of the launch class." },
  { month: "Nov '25", driver: "Reduced Services", note: "5 calendar Sundays but only 3 full services — 11/2 and 11/30 had no service held. This effectively made it a 3-service month. Giving held reasonably well at $8.1K given the reduced opportunities." },
  { month: "Dec '25", driver: "Year-End Outliers", note: "3 large year-end gifts ($10K, $5.5K, $2K) inflate total to $47.6K. Baseline (ex-outliers) ~$30K. 4 full services. Recurring actually dipped slightly — year-end one-time giving dominated." },
  { month: "Jan '26", driver: "Reduced Services + Post-Holiday", note: "4 calendar Sundays but 1/25 was Zoom only — 3 effective in-person services. Outlier gifts gone. Despite reduced access, recurring grew to $3.8K showing the committed giver base is holding. -80.7% MoM is misleading due to Dec outliers." },
  { month: "Feb '26", driver: "Recurring Growth", note: "First full month with 4 uninterrupted in-person services since October. Recurring hits $4.8K (+26% MoM). 10 new givers. One-time jumps to $9.5K — best regular month to date." },
  { month: "Mar '26", driver: "5 Services, 1 Launch Team", note: "5 calendar Sundays with 4 full services (3/22 was launch team only). Strong month at $15.2K. Recurring crosses $5.7K. The 4 full services + 11 new givers drove the result — even with one reduced service." },
  { month: "Apr '26", driver: "Reduced Services", note: "4 calendar Sundays but 4/12 was launch team only — only 3 full in-person services. Total dips to $14.2K. Recurring nearly flat (-$52). The drop from March is largely explained by one fewer full service opportunity." },
  { month: "May '26", driver: "Recurring Record", note: "5 calendar Sundays with 4 full services (5/31 launch team only). Recurring hits all-time high of $8.2K (+43% MoM). Fewest new givers (5) yet strongest regular month — giving depth is growing independent of new giver acquisition." },
  { month: "Jun '26", driver: "Summer + Reduced Services", note: "4 calendar Sundays with only 3 full services (6/28 launch team only). Summer softness compounds the reduced access — total drops to $12.4K. Recurring dip to $6.2K worth watching. Effective services per month has been 3 for 3 of the last 4 months." },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmtDollar  = (v) => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v.toFixed(0)}`;
const fmtKpi     = (v) => { const n = Number(v); return n >= 1000 ? `$${(n/1000).toFixed(1)}K` : `$${n.toFixed(0)}`; };
const fmtDollarFull = (v) => `$${Number(v).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

const pct = (curr, prev) => {
  if (prev == null) return null;
  if (prev === 0) return curr > 0 ? "+∞" : "—";
  const v = ((curr-prev)/prev)*100;
  return (v>=0?"+":"")+v.toFixed(1)+"%";
};

const Badge = ({val}) => {
  if (!val||val==="—") return null;
  const isPos = val.startsWith("+");
  return <span style={{display:"inline-block",background:isPos?"rgba(22,163,74,0.18)":"rgba(220,38,38,0.18)",color:isPos?"#4ade80":"#f87171",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:4,marginLeft:6,fontFamily:"Calibri, sans-serif"}}>{val==="+∞"?"New":val}</span>;
};

// ── TOOLTIPS ──────────────────────────────────────────────────────────────────
const GivingTooltip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  const recurring = payload.find(p=>p.dataKey==="recurring")?.value??0;
  const oneTime   = payload.find(p=>p.dataKey==="oneTime")?.value??0;
  const total     = recurring+oneTime;
  const idx       = givingData.findIndex(d=>d.month===label);
  const prev      = idx>0?givingData[idx-1]:null;
  const prevTotal = prev?prev.recurring+prev.oneTime:null;
  const d         = givingData[idx];

  const Row = ({label:rl,value,prevVal,color,isMoney=true}) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:9,height:9,borderRadius:2,background:color,flexShrink:0}}/>
        <span style={{color:"#94A3B8",fontSize:11,fontFamily:"Calibri, sans-serif"}}>{rl}</span>
      </div>
      <div style={{display:"flex",alignItems:"center"}}>
        <span style={{color:"#fff",fontSize:12,fontWeight:700,fontFamily:"Georgia, serif"}}>{isMoney?fmtDollarFull(value):value}</span>
        {prevVal!=null&&<Badge val={pct(value,prevVal)}/>}
      </div>
    </div>
  );

  return (
    <div style={{background:"#0F1F3D",border:"1px solid #C49A3C",borderRadius:10,padding:"12px 16px",minWidth:270,boxShadow:"0 8px 24px rgba(0,0,0,0.35)"}}>
      <div style={{marginBottom:8}}>
        <p style={{color:"#E8C472",fontWeight:700,margin:0,fontSize:14,fontFamily:"Georgia, serif"}}>{label}</p>
        {prev&&<p style={{color:"#64748B",fontSize:10,margin:"2px 0 0",fontFamily:"Calibri, sans-serif"}}>vs. {prev.month} &nbsp;·&nbsp; {d.fullSundays}{d.fullSundays < d.sundays ? ` full (${d.sundays} total)` : ""} Sundays{d.sundayNote ? " ⚠" : ""}</p>}
          {d.sundayNote&&<p style={{color:"#D97706",fontSize:9,margin:"2px 0 0",fontFamily:"Calibri, sans-serif"}}>{d.sundayNote}</p>}
      </div>
      <Row label="Recurring" value={recurring} prevVal={prev?.recurring} color="#1A3260"/>
      <Row label="One-Time"  value={oneTime}   prevVal={prev?.oneTime}   color="#C49A3C"/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <span style={{color:"#E8C472",fontSize:11,fontWeight:700,fontFamily:"Calibri, sans-serif",letterSpacing:1,textTransform:"uppercase"}}>Total</span>
        <div style={{display:"flex",alignItems:"center"}}>
          <span style={{color:"#fff",fontSize:14,fontWeight:700,fontFamily:"Georgia, serif"}}>{fmtDollarFull(total)}</span>
          {prev&&<Badge val={pct(total,prevTotal)}/>}
        </div>
      </div>
      <div style={{display:"flex",gap:16,padding:"6px 0"}}>
        <div>
          <p style={{color:"#64748B",fontSize:9,margin:"0 0 2px",fontFamily:"Calibri, sans-serif",textTransform:"uppercase",letterSpacing:1}}>Avg Gift</p>
          <p style={{color:"#fff",fontSize:12,fontWeight:700,margin:0,fontFamily:"Georgia, serif"}}>{fmtDollarFull(d.avg)}</p>
        </div>
        <div>
          <p style={{color:"#64748B",fontSize:9,margin:"0 0 2px",fontFamily:"Calibri, sans-serif",textTransform:"uppercase",letterSpacing:1}}>Median Gift</p>
          <p style={{color:"#fff",fontSize:12,fontWeight:700,margin:0,fontFamily:"Georgia, serif"}}>{fmtDollarFull(d.median)}</p>
        </div>
      </div>
      <div style={{marginTop:8}}>
        <div style={{height:5,borderRadius:3,background:"#1E3A6E",overflow:"hidden",display:"flex"}}>
          {total>0&&<><div style={{width:`${(recurring/total)*100}%`,background:"#1A3260"}}/><div style={{width:`${(oneTime/total)*100}%`,background:"#C49A3C"}}/></>}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
          <span style={{color:"#64748B",fontSize:8,fontFamily:"Calibri, sans-serif"}}>Recurring {total>0?((recurring/total)*100).toFixed(0):0}%</span>
          <span style={{color:"#C49A3C",fontSize:8,fontFamily:"Calibri, sans-serif"}}>One-Time {total>0?((oneTime/total)*100).toFixed(0):0}%</span>
        </div>
      </div>
    </div>
  );
};

const GiverTooltip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  const newG    = payload.find(p=>p.dataKey==="newGivers")?.value??0;
  const activeG = payload.find(p=>p.dataKey==="active")?.value??0;
  const total   = newG+activeG;
  const idx     = giverData.findIndex(d=>d.month===label);
  const prev    = idx>0?giverData[idx-1]:null;

  const Row = ({label:rl,value,prevVal,color}) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:9,height:9,borderRadius:2,background:color,flexShrink:0}}/>
        <span style={{color:"#94A3B8",fontSize:11,fontFamily:"Calibri, sans-serif"}}>{rl}</span>
      </div>
      <div style={{display:"flex",alignItems:"center"}}>
        <span style={{color:"#fff",fontSize:12,fontWeight:700,fontFamily:"Georgia, serif"}}>{value}</span>
        {prevVal!=null&&<Badge val={pct(value,prevVal)}/>}
      </div>
    </div>
  );

  return (
    <div style={{background:"#0F1F3D",border:"1px solid #C49A3C",borderRadius:10,padding:"12px 16px",minWidth:230,boxShadow:"0 8px 24px rgba(0,0,0,0.35)"}}>
      <div style={{marginBottom:8}}>
        <p style={{color:"#E8C472",fontWeight:700,margin:0,fontSize:14,fontFamily:"Georgia, serif"}}>{label}</p>
        {prev&&<p style={{color:"#64748B",fontSize:10,margin:"2px 0 0",fontFamily:"Calibri, sans-serif"}}>vs. {prev.month}</p>}
      </div>
      <Row label="Active Givers" value={activeG} prevVal={prev?.active}    color="#028090"/>
      <Row label="New Givers"    value={newG}     prevVal={prev?.newGivers} color="#C49A3C"/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:8}}>
        <span style={{color:"#E8C472",fontSize:11,fontWeight:700,fontFamily:"Calibri, sans-serif",letterSpacing:1,textTransform:"uppercase"}}>Total Unique</span>
        <div style={{display:"flex",alignItems:"center"}}>
          <span style={{color:"#fff",fontSize:14,fontWeight:700,fontFamily:"Georgia, serif"}}>{total}</span>
          {prev&&<Badge val={pct(total,prev.newGivers+prev.active)}/>}
        </div>
      </div>
    </div>
  );
};

const DonationTooltip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  const recurring = payload.find(p=>p.dataKey==="recurring")?.value??0;
  const oneTime   = payload.find(p=>p.dataKey==="oneTime")?.value??0;
  const total     = recurring+oneTime;
  const idx       = donationData.findIndex(d=>d.month===label);
  const prev      = idx>0?donationData[idx-1]:null;
  const prevTotal = prev?prev.recurring+prev.oneTime:null;

  const Row = ({label:rl,value,prevVal,color}) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:9,height:9,borderRadius:2,background:color,flexShrink:0}}/>
        <span style={{color:"#94A3B8",fontSize:11,fontFamily:"Calibri, sans-serif"}}>{rl}</span>
      </div>
      <div style={{display:"flex",alignItems:"center"}}>
        <span style={{color:"#fff",fontSize:12,fontWeight:700,fontFamily:"Georgia, serif"}}>{value}</span>
        {prevVal!=null&&<Badge val={pct(value,prevVal)}/>}
      </div>
    </div>
  );

  return (
    <div style={{background:"#0F1F3D",border:"1px solid #C49A3C",borderRadius:10,padding:"12px 16px",minWidth:230,boxShadow:"0 8px 24px rgba(0,0,0,0.35)"}}>
      <div style={{marginBottom:8}}>
        <p style={{color:"#E8C472",fontWeight:700,margin:0,fontSize:14,fontFamily:"Georgia, serif"}}>{label}</p>
        {prev&&<p style={{color:"#64748B",fontSize:10,margin:"2px 0 0",fontFamily:"Calibri, sans-serif"}}>vs. {prev.month}</p>}
      </div>
      <Row label="Recurring" value={recurring} prevVal={prev?.recurring} color="#0F1F3D"/>
      <Row label="One-Time"  value={oneTime}   prevVal={prev?.oneTime}   color="#C49A3C"/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:8}}>
        <span style={{color:"#E8C472",fontSize:11,fontWeight:700,fontFamily:"Calibri, sans-serif",letterSpacing:1,textTransform:"uppercase"}}>Total</span>
        <div style={{display:"flex",alignItems:"center"}}>
          <span style={{color:"#fff",fontSize:14,fontWeight:700,fontFamily:"Georgia, serif"}}>{total}</span>
          {prev&&<Badge val={pct(total,prevTotal)}/>}
        </div>
      </div>
    </div>
  );
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const SectionHeader = ({eyebrow,title,subtitle}) => (
  <div style={{width:"100%",maxWidth:860,marginBottom:16}}>
    <p style={{color:"#C49A3C",fontSize:11,fontFamily:"Calibri, sans-serif",fontWeight:700,letterSpacing:3,margin:"0 0 4px",textTransform:"uppercase"}}>{eyebrow}</p>
    <h2 style={{color:"#0F1F3D",fontSize:22,fontWeight:700,margin:"0 0 4px"}}>{title}</h2>
    <p style={{color:"#64748B",fontSize:13,fontFamily:"Calibri, sans-serif",margin:0}}>{subtitle}</p>
  </div>
);

const KpiCard = ({label,value,note,accent,isCount}) => (
  <div style={{background:"#fff",borderRadius:8,padding:"14px 16px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",borderLeft:`3px solid ${accent}`,minWidth:0}}>
    <p style={{color:"#64748B",fontSize:9.5,fontFamily:"Calibri, sans-serif",fontWeight:700,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</p>
    <p style={{color:"#0F1F3D",fontSize:20,fontWeight:700,margin:"0 0 3px",fontFamily:"Georgia, serif",whiteSpace:"nowrap"}}>{isCount?value:fmtKpi(value)}</p>
    <p style={{color:"#94A3B8",fontSize:9.5,fontFamily:"Calibri, sans-serif",margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{note}</p>
  </div>
);

const Divider = () => <div style={{width:"100%",maxWidth:860,height:1,background:"#E2E8F0",margin:"40px 0 32px"}}/>;

const GivingTopLabel = ({x,y,width,value}) => {
  if (!value) return null;
  return <text x={x+width/2} y={y-5} fill="#0F1F3D" textAnchor="middle" fontSize={10} fontFamily="Calibri, sans-serif" fontWeight={700}>{fmtKpi(value)}</text>;
};
const CountTopLabel = ({x,y,width,value}) => {
  if (!value) return null;
  return <text x={x+width/2} y={y-5} fill="#0F1F3D" textAnchor="middle" fontSize={10} fontFamily="Calibri, sans-serif" fontWeight={700}>{value}</text>;
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function GivingDashboard() {
  const [expandedMonth, setExpandedMonth] = useState(null);
  const lastIdx = givingData.length-1;
  const r3Label = `${givingData[lastIdx-2].month} \u2013 ${givingData[lastIdx].month}`;

  const r3Recurring = (givingData[lastIdx-2].recurring+givingData[lastIdx-1].recurring+givingData[lastIdx].recurring)/3;
  const r3OneTime   = (givingData[lastIdx-2].oneTime  +givingData[lastIdx-1].oneTime  +givingData[lastIdx].oneTime  )/3;
  const r3Total     = r3Recurring+r3OneTime;
  const r3Avg       = (givingData[lastIdx-2].avg+givingData[lastIdx-1].avg+givingData[lastIdx].avg)/3;
  const r3Median    = (givingData[lastIdx-2].median+givingData[lastIdx-1].median+givingData[lastIdx].median)/3;

  const r3New    = (giverData[lastIdx-2].newGivers+giverData[lastIdx-1].newGivers+giverData[lastIdx].newGivers)/3;
  const r3Active = (giverData[lastIdx-2].active   +giverData[lastIdx-1].active   +giverData[lastIdx].active   )/3;
  const r3TotalG = r3New+r3Active;

  const r3DonRecurring = (donationData[lastIdx-2].recurring+donationData[lastIdx-1].recurring+donationData[lastIdx].recurring)/3;
  const r3DonOneTime   = (donationData[lastIdx-2].oneTime  +donationData[lastIdx-1].oneTime  +donationData[lastIdx].oneTime  )/3;
  const r3DonTotal     = r3DonRecurring+r3DonOneTime;

  const LOGO = "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Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjQxNDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj43MTg8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpVc2VyQ29tbWVudD5TY3JlZW5zaG90PC9leGlmOlVzZXJDb21tZW50PgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KxP+WkQAAABxpRE9UAAAAAgAAAAAAAADPAAAAKAAAAM8AAADPAAA+fuAG3gkAAD5KSURBVHgB7J1rzF5Xld/PNGBEBHzh0kRxCLmUAInCJZPYRJiJIFIQosXKxaMRRqGMyqQCpw1YkyDmQ6WZlFhyxpVdNLQjRbFi2iGuI6giREYzowxGiW0GZoq4heZCSKKEBL4ACrIZq33XYy+/690+l3357332Oc//fHjPfe+1fmuds/9nv/s553fWr1///xpOJEACJEACJEACJEACJEACvQR+h8K5lw93kgAJkAAJkAAJkAAJkMCCAIUzE4EESIAESIAESIAESIAEPAhQOHtA4iEkQAIkQAIkQAIkQAIkQOHMHCABEiABEiABEiABEiABDwIUzh6QeAgJkAAJkAAJkAAJkAAJUDgzB0iABEiABEiABEiABEjAgwCFswckHkICJEACJEACJEACJEACFM7MARIgARIgARIgARIgARLwIEDh7AGJh5AACZAACZAACZAACZAAhTNzgARIgARIgARIgARIgAQ8CFA4e0DiISRAAiRAAiRAAiRAAiRA4cwcIAESIAESIAESIAESIAEPAhTOHpB4CAmQAAmQAAmQAAmQAAlQODMHSIAESIAESIAESIAESMCDAIWzByQeQgIkQAIkQAIkQAIkQAIUzswBEiABEiABEiABEiABEvAgQOHsAYmHkAAJkAAJkAAJkAAJkACFM3OABEiABEiABEiABEiABDwIUDh7QOIhJEACJEACJEACJEACJEDhzBwgARIgARIgARIgARIgAQ8CFM4ekHgICZAACZAACZAACZAACVA4MwdIgARIgARIgARIgARIwIMAhbMHJB5CAiRAAiRAAiRAAiRAAhTOzAESIAESIAESIAESIAES8CBA4ewBiYeQAAmQAAmQAAmQAAmQAIUzc4AESIAESIAESIAESIAEPAhQOHtA4iEkQAIkQAIkQAIkQAIkQOHMHCABEiABEiABEiABEiABDwIUzh6QeAgJkAAJkAAJkAAJkAAJUDgzB0iABEiABEiABEiABEjAgwCFswckHkICJEACJEACJEACJEACFM7MARIgARIgARIgARIgARLwIEDh7AGJh5AACZAACZAACZAACZAAhTNzgARIgARIgARIgARIgAQ8CFA4e0DiISRAAiRAAiRAAiRAAiRA4cwcIAESIAESIAESIAESIAEPAhTOHpB4CAmQAAmQAAmQAAmQAAlQODMHSIAESIAESIAESIAESMCDAIWzByQeQgIkQAIkQAIkQAIkQAIUzswBEiABEiABEiABEiABEvAgQOHsAYmHkAAJkAAJkAAJkAAJkACFM3OABEiABEiABEiABEiABDwIUDh7QOIh4xB494YrT1W8ccOGZt26dafWzz/vvMXyGS87o/nVL3+9WH71a151ar8syHbddvyfjzdPPvXUmv3Hjh07tX7o8OHF8iOHj5zatswLyv69mzY1yvqll37TvPnii5r/9Kd3NP/w7e8sMx76TgIkQAIksKQEKJyXNPA1ue2KNBVox397vHnnO95ezNR//Kf/0zz+xJOnxPZjjz/RiLgWUT1nQS38b9q6tVHuAryNvfA54+VnNI8//njzHz7zx8XiwopIgARIgARIoBYCFM61RGIJ7KhFIMegFtH4ws9fXJwqPdk/e/GFyYpqFcrSA7/pPVc1l11y6Rok3/rOt5tXvOIVzY8ffaw588xXNnv37Tu1f84PEKec5AIJkAAJkAAJdBCgcO4Aw83pBESgvWllSMXvrfy7f/2557T2YvbVoj2czz33/OIwGW4hkx1yocMtpFdYhnPIpEM6LrrwgsW6HbLxhte9frEN1ZOtglrqePrZZ5pdu/csyq/pj8RBh1xIHFyhLLZ+9/vfW8TnueefXwhlCuSaIkhbSIAESIAEaiFA4VxLJGZgR6xQFtGmvZsiir9x8OApGrkEnNgqQvvcc9YvhmaIoEaIaRXSOsxjTCEtPsoQjD6xfPCbDy/GMEuvci7Wp4LJBRIgARIgARKYOAEK54kHcEzzY4Sy7dlUkVyL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OCdmwOte+9pTJbzWLP/iF784tV0Xft6yTfdxjiHQFg83FowDhjVLIQESIAESIIFlI/D/AQAA//+4FAd/AAA3vUlEQVTtnVGS3bhuhn33cStvqezA9mxk8jKzg3GqvBJXubODmZfJRjz2DlJ5y0YSo214YBokQfCnROn8emhJFEUAH0AQR60+/Y9//vOf//eCGwmQAAmQAAmQAAmQAAmQQJPAP1g4N/nwIgmQAAmQAAmQAAmQAAk8E2DhzEAgARIgARIgARIgARIggQABFs4BSOxCAiRAAiRAAiRAAiRAAiycGQMkQAIkQAIkQAIkQAIkECDAwjkAiV1IgARIgARIgARIgARIgIUzY4AESIAESIAESIAESIAEAgRYOAcgsQsJkAAJkAAJkAAJkAAJsHBmDJAACZAACZAACZAACZBAgAAL5wAkdiEBEiABEiABEiABEiABFs6MARIgARIgARIgARIgARIIEGDhHIDELiRAAiRAAiRAAiRAAiTAwpkxQAIkQAIkQAIkQAIkQAIBAiycA5DYhQRIgARIgARIgARIgARYODMGSIAESIAESIAESIAESCBAgIVzABK7kAAJkAAJkAAJkAAJkAALZ8YACZAACZAACZAACZAACQQIsHAOQGIXEiABEiABEiABEiABEmDhzBggARIgARIgARIgARIggQABFs4BSOxCAiRAAncj8NOrl99Mev3q1YufXtrzv4+l018fPz33/fDpy15O3r1/em7jDxIgARJ4JAK3Kpz/64/fob6TReIOi4MskG/fvIGw+fmXXyHjcBASIIHjCWgueG2K5lkt3j395/MQd8iVsyx4PwmQwP0J3Kpw/t//+W+4x/7lX/8NPubRA8pi+SfoQ8UdeBzNn/JI4CwC+lRZPjiXxbL3FFn0fPvmt7S6UkSzgE7j440ksAUBzRuqjPxGSjbO7S9EWDh/4VD9KYvL1Z+ysnCuupcXSOB2BHTRK4tlyWXvnp5efPj62kXLcBlDFstsEc0CukWX10jgGAKaC1SaFsD2tay/r33/epa2655zWkm8eMHC+W8W1aN///x6QmSxqQ5w8gUWzic7gOJJ4AACMs9niuWaivIKXPm0uta3bL967izt4TkJ7E7g7X+8SX/gbdnG3zb/TYeF898sqkdXf+rMwrnqWl4ggVsQKBfLkafLEQAsniOU+n3KJ4D2Dn0ayF+HWyo8HiUwM1drsvi0+XsyLJy/51E9u3LgsHCuupUXSODSBFYXzApnNofc7cmzcPd+3a28sk/or7zOqO3cn0egzAcITRiTP1Jk4fwjk2rLVZP/7KJngfDXNZYGj0ngHALeArk6P3kyR6y/S+6Y5VBjxgKlRobtUQIrviBhdV6J2rZTPxbOA9646isbLJwHnMyuJLAxAW8uH1lwzfwa+Kr504bDqqJZZNzlg4XlxePjCKyIzSNzy3Gk5iWxcB5keMVPX95iO2j2t+5M7t9Q8IAEDiXgLYxHL2yeDiMQrpg/rX0rnujJ+Ef70drE4+sTQK7xlgbXe0vj72MWzn+zCB9dLZiQk+pqtoedyo4ksCkBmb/lt2WIqmcUobO55MpPnWc/NNTCi0VzjQzbowRWxCbjsk6fhXOdTfXK1ZL/7GJnQbBwtjR4TAJrCXgL4pn5B5FLzij4Z73k+WF2TL2fOVVJcJ8hsCI2WTS3PcHCuc2nevVKyR+x2CkIJnklwT0JrCXgvU+8w4I2+7rClXKnenjWZh2n3O/gz1Innl+LwIrYvOIcPdJrLJyTtM986jOqMgvnUWLsTwLnEti1aBYqswv1lXKn2LviiZ6My6JZKHCbIbAiNhmXfY+wcO4zqva4SoCxcK66kBdIYDsCXtG8U7E5WzgL8Cv95gphrxdkV2Lg6c+28wmsiE3GZd+vLJz7jJo9rvArDRbOTRfyIglsQ2D3ohmVS66yOK94oifBdpWHLttMDCryA4EVscm4/AGz28DC2cUSb9zpSVBNa9RiJ+NfZcGrsWA7CexKwCuaRdedPpyjFuudbKrFA8rWcnwWJyURno8SWBGbjMu4F1g4x1lVe+6+CLBwrrqOF0jgdAIyP72vmxPFdsstqAV7N7u8IFjxa3CRw4cPHm22jRBYEZtXmJMjjFb2ZeEMortzMmThDHIyhyEBMIHW3NzxCVDtqfgolt0XadQHhJLLjj4tdeT53gRWxCbjcsznLJzHeFV77xx4rcW5alDlws4fECoqs5kEtiVQe3K0az6p6TsKeOfCeUVhInx29emo79j/XAKoOWit4LpuafSPWTj3GYV77LoYsHAOu5AdSeAwAq0CbceFrKXvKLQd7VMbUE/VdTzd72yz6sj93gSQc1At5Qc6JRHfs3COs+r23PUPBVk4d13HDiRwKIHWArjrQoZ80rVrEdnyy0yA7OrTGZt477EEVsQm4zLnQxbOOW7Vu3YMRBbOVXfxAgmcQqBVhO5YVKIX7R1tlEBo+SUbKDuuCVlbeN95BFb8JmTX35KfRzkmmYVzjNNQr92CkYXzkPvYmQSWEmgVobsWWS2dR2E9go2Wya4fEqyOPN6bAHL+qaW7zkPVb+c9C+cF3tntlQ0WzguczCFJIEGgtQDuvJAhn8TuaGfLLwk3f7tlR1u/KceDyxBAzj81mh/olMT4noXzOLPQHTs9dWbhHHIZO5HAUgK9ebhrkYUuKndcsFcUJrv6c2mQc3A4AfT8EwUZm3NuYuE8x696905PnXsLdtUI58KOi56jJptIYDsCvQVw17mFLCp3XLB7fskG0q7+zNrD+44ngFy7Vfsd56DqdpU9C+eFntolQJGTj4vBwoDh0Lcl0CvOdskVpQN6epf9e+e72YnMjdb23ey0uvH4OgTQ808s5xo+738WzvMMmyPs8MoGcnHgpGu6mxdJwCXQWwB3yBOe4sinzTL+bvljxTcVsGj2IoltowR6OWN0POnP2MxQ+/EeFs4/MoG27PDKxqMUzmKnbq9fvdLDH/Z/ffz44sPHTz+0s4EEVhCILIC7FZTCIaL3CK/dFm20fcpiR1+qbtxfhwD6Q6tYztjE+J+Fs8NRit3Xpghzugw1nb1g3LFwFpvevnnz7IcZX4mvP3z6UkS/e/805Fd2JoEIgV6BdnZ+qNmAXrh3W7TR9gnHXX1Z8zHb9yTQyxkZrRmbGWr+PSycHS7ya1N5Yvn2zW/O1VzTmYvGXQpnVLHc8qAkF9nQRbQkQtSG1i2ql/BvPcmPjnPmE3+UH0Z80CvQzswNNZ+hF+7dFm20fcJxNxtrvmX7/gR6OWPUAsbmKLF2fxbODh993xD5/tuZr2xcuXA+olh2QuC5CZlskLF0VqGFskHnV437qnZUsTQSFxGZZ/mzxRm9cO9kY8QnLTa1azvZWNOR7fsTWBGfjE2s31k4Ozx1YUcWnCJGx3VELm1C2nHkBEQVarNwRwqlmiykD86KI1QxddaHSNSCNMK/J/MsFrU4lfaezq17vWuI+eONm21DxbGVv5uNVjceX4cAeu6J5YxNvP9ZODtM7cKILN7OWiSRRdsRhTNSX8e9qSbx3bunp6k/KkQt2GckQrRPjoij0tGouTyie8/nZ+WEko2er1i4R3ipHqv2K+zbzYer2HHc9QR6+SKjwU7zL6P/jvewcHa8YgtndMFw9aJn5SQU1vIHfzN/7Oe4E9o04z9U4XbGQo0uOOwcgzqoMRhiURr1f0/m6HgN8yCXevqOCtnJPnQuVxY72ag6cX89AugcKwQYm2vigIWzw7Vc1NEBXY7vqABtQi4YqwpnNGMoQGewTEK6gh8cU5+bUEW/jn/0HEDF14jfIzJHxlN2q/YRfUdl075RYuz/qATu/KH1bj5l4ex41FvUkYXD0U8Mdy/YkGwddy5ryhQFqOToxegyQz8PjNJbdTx6DqCKwpEPjhGZmRhShiN7yQGt7y5H5gjV6yjbVF5rH/FF6/7atZF4qI3BdhJYEZ+MzXVxxcLZYesVJeiFxZPhqAJpQuqOnoxXLZrVMaMFIMreUbmqb2aPjB+Vf6T+IhNR+I8WgpHF8Kg8IPa39I/oqr6L7tG5IirX64fwfzlui2fZl+ckUCOwYu4xNmu0Me0snB2OtcUMHeBHLSzIwgepM6qIdFx4aNNIEYjyxYjMWRjouFd9avNMr6P2KOaji1Ekvo9goP6rzV29juIt44yyQsoux7q7faW9PL8WgRXxWZvr1yKzr7YsnB3ftBYz5JOLoxYXVOEgqBATEqmP475TmqK+RNqO8EUEVqQAjIxT9mnNs7LvzDlqYRrlHeG2moHa3opPZE4TPx35oa4XF2p/r9/o9dFYGB2f/R+DwIr4bM31x6C63koWzg7j1mKGLHxEdEuWo1qqCanz7IKB1CUFY+FN0YQVKagiah4RO6IHurBS244qsBC8o75V22Qfkbvah+K7lu4rFu7VNlnGveMVsdvi2dOH10nAEkDHJ2PT0l13zMLZYdtL/JEF0RnWbTqieEAWq7OFMzpRuFBPbIwkLlT8XC12Srccob/IRMRcxK+lfRE/Z8Yt5dTOtSiu5TO9Xrs/077SnlF97m7fKA/234vAivicXZ/3IrSvNiycHd/UFhrtiixEZczViw1S35mJuSJRqE9kL4WYbB8+fdn/9fHj8/nrV6+e9/Ljp5cvl39PdM+fKH8cUXiu9tlMPH1zauMApX9GzzMLZ7W7FYuIDxQl+gyncgzU+Qr7emsDSneOc38C6PhszfX70zzWQhbODu9IctSFybk91RSRmRr4802oQk3kZxdGNC9lIcWj/Ec/2Vpft6X9dS/6yPb2zW/aBN33/BkpqiIK9eRExmj1QelZk7Faf0TcZT+gRGRnx67xlHad762xI7q1ZHjXdlq4726fx59t1yGwIj6za/N1qO2jKQtnxxfRxRxZVLQWOUfFoSZdSIduqnTOTk70p2vhNfsvsNXEFUms509U7ERjVW0d3aP9VsrvcSr7j54jOGcLwui8y86pGgu1uTbuinjPMqrZMNO+wj7Rp8ZzRlfe+3gEVsTnTvPvETzKwtnxcrQYiS6Mjgi3KSrXvbnRiNQzs3joQt5QMXwJWTBboZLM0K9xtJIZyicrC0+UjpZzebxSf5GFKPwzMS+yo/yQ814X5VbsIZiIfXbLMrJjoI5X2NfiidKb4zwGAXR8MjaPjxsWzg7zkYUMXRT+/MuvjkZzTdEFPCJldIHUhTwydq/P6iJL5CP1lfFasYRIoCuZoFkID28bjSlvDK8Nof8s34iPZ2Wo7WpvayHVPnoPYt+Shxh/ZIy72zfCgn33I7AiPlflz/3o7aMRC2fHF61ix+kOeaql465YhM4snCOFg9re2q/gUpOHTG6togj1oWs0Xmt2l+0o/cpxy/NV+iP8OBt3UR1mGaivWvpGdSn90zpvyWvdt+LaCvtETxYmK7z1mGOi1kOlt9P8U50eYc/C2fHy6CKGTtij8h0Tvms6q3BGcTkjOaB0F0fU/InyS23874IgcYJO8jUVVvkXoT+CbVSPjCyJobdv3jx/U0yPY1SPmp+89p2KSv3w4OmZbesxzY7L+x6PAHJNEXqthzKPR/dYi1k4O7wzCxgyaaMnBKpAE1QjCyVioT5z4UL5tOVPBKPW+E54h5qQMdMTuLP+I/Fes3NkwYzGuy2YRW4vZ43oULOjbI/qWt634vzu9q1gxjGPI7AiPntz/jjrHk8SC2fH55mARBcayEUJqVu0kEAliqg8x42QJlTxXIsp1PhoTij/RZ2wo/7IOTjqZ5EtW/ld5OUfsMqHjt63y6zwJZJNNEZa/RAfQMvx0TFZjs/zxyGAjs/d5t/jePKLpSycHY/Xihyn63dN6AUKlbjPKJwRiSLrh++cMnmCYld7qooaH81qtNATzJLMy8Iuih+tP2IuohcnhE6WZ0Q/VHxZuXKMyk3luJlzNFfRIcI2oyvveTwCK+Jzp/n3eB598YKFs+P1mUU8U3A4Kjw31YqtWv9aO3LxjExYRKLYaeFC+dRjh/LNTMx6cZP54CM+ky3zT2XQ/s7oX3Lw/FX2GT1HzI3IU2bVCxW7Op7s0b6yY48eI3iWMlF5txyX53sSkBysm/6XWXkAUG6vTb+ROYDIRVaXEdn2Ph7jCLBwdljOFCGoQkjVmtFFx0DqFCkmEIkiIkftW71H8av5ElHcIBf7rL1in2x//vH7sEt20N8qvXpxGi34hI9svdcyrA2jMuy9tePVXGpya+2IXFOOXZunZb+Zc5ljXpFmi7NyfI2BD5++xsL7L/8xtezHc5+AMJdN/phWthbr5w6VHyNzAD0HR2RX1H/+fvky9koWjLUavS/tLJwdPrOJE1EIqVqIgiJbCKkOdt8raBGJApEcrM6IY4RPa75EMBMbe76Jcsjqo/KzxYzeH9Wz1i+rvx3vqBi0BZTI1yddWhzpO84j/05exkEwkHHKDeWjctzM+QobV/h9tmCTvFEWNspLrkmsvLtpEa3s1F7Zj84FGUO/ecaOkzkeiQ+Rm3mI0NIrO/9EFymWs6/SiU4jtrdsuMM1Fs6OF2cLZ/SEmQ1YpD69iYtYzHoyHJctb0Ix9GJr5dgZMJkPCTZGM/eLnh6bo/Qv5ewYg6WOrfPsh5fWmNbHrX5HXEPNmVJXlN9Fv+yTTSmGa79ZaOXXnfwjXEVX/SBYcpbz2ocBr69tG8kT2Vxk5elx7cGHXi/3LV+VfSPnGf9qHGZZe3pl9PDGuXIbC2fHeyMT07n9uQk9aWZ0Qi4yvYUFsWD3ZNSYr25H2FbzIyLBoxJaxk4rOxv7NTajfs3ob2VYW2z7VY6z/Fv27cYEMV9Ke2dtlDwrT/Uy7/iLLq2C2era8++sHVbWzPHsPPRkR21Drnmqx8i61PORjhndjxbtKwpmq2vUD/aeOx2zcHa8iVrAkcl9dOJYs5BJpJc8ZpPlzhMS4c+aH1eObWOhd5xN+HbOZOOtxqans72e1d+OsXMMWj29Y4T93ri9ee/ds6pthY0zPp8tUiTua0+YawwjDOycrI2zqj2i36jsaH7I5p+WPqMsZ9fBUpcR+Yi1pJTvnc/MGW+8K7WxcHa8NRKkzu3fmtATOKsXUo/WAopIllkbv0FfeIDi6DFcOfYIkqwPS5uyC0c5zoju0jerv5Uzq4Md6+jjLPeWnrstkCtszPhc5uzsu7MzbCMcZsZvxUTrGmIOeuNH1gZUHrXyRxmi7Y/KX2G75eAdR3zi3Xf1NhbOjgeRwYCeRNkEj/ojhZZ8hK2t8R1XHd4UWax6StXia+XYPZ30euZphZfYM+OIDjU2ql9vP8sw+lSrp8cZ1xHzr9Tb823Z58jzHWxEFMzCbJZtdI7Nyhn175k+mp3/pa2ZfIDWobcmevEoeusfGItN2deHSh7leYZPOcYVz1k4O16bXbzLIZETKZMEkZ9EW5MYYWdr/JLrGefRxaqlWy2+EGPPJrKMD72YzC6eNTYtnnoNEeeeLTr+zvss755NO83HFTaO+hulw0ycq89GdBm1U2WM7kd0io4dyWle8Rgdv9VvlBva/p78Mue1+iPWF4/VTjnC029FGwtnhyoiqdlhy+C21zLHo/oh5bcmSabosvZHEqTtf8YxIvnUkhvCTzMMs0nfi8esLWfob+OoFd+2327Hs3PPs6cWp17fI9pW2Bj1dzaePS4orqM6oeR6NmnbCh95+UXlCYPZ12V0rHI/yiubP0u5et6Tb+VF8uZovKgevX3LP717r3qdhbPjuRWBgCi4VNXIJNG+skdOmNpCg5Axape18ahjhB9bdiIWnpqPeoxsIu71tddr8jK2tNhYmd5xVn8da0a2jnHGftZuT+feou3ds7LtLBvRhRmSaybnIuWX/j7aRyvkWZtG64BMvrPyyuNaXpV+arvkrJE/LEWsX6Weo5zK+694zsLZ8dqKQMgkOUe1b00jCRApuzaZdSJ/UzB5IIlg9232OzFbBRoisWXjNyO7FYeZ8cT3Wf1nF66WLbvGJGrelfbV5nnZ74jzFTa25qDahMybMiY6vrL6ZeeXcqntZ+dfOW6Nl9i96imz6lCTrdfLPTpGW/I1r0ZieLWeMn5L11L+Xc5ZODueXJVY0JMrqmc2wTpoqv+dDm2bJ/tObbXCBOGrTEIVtpmFr5U0szERjWsbDwhuGblWh6OPETZ7Ord86vVf3ZaJy55OPV9nY7cmdwXTrP+z+aFmm7SjecmYXo60csQOedo6893ZIsfbRv2FjNGaf8Tf+oFhVD+10fLTttl9VpdZuWfez8LZod9Lqs4t4Sb9tBi+odGxNsHKW7IJthxHzr1kJu0rJqSMe9etFmMIX0XjwrLN+q9mh4ydteVI/S2DWmzbPjsdI3OJ2rXbIpiNS7XH2/dsRMvsyfN0jLTN6JmZYzWdZvSojekxs3LsdWTRKvrYsWv62Xarl23PHnvybS71rkdlrcgZrTUgqtfV+rFwdjy2MhDsBHBEDzdFdEXKrBUX6OQxDOJiN7T8hkhurfE9VFn/1eJBZWQWtcyiPstsZjFSW4/cZ/3V07Hnz979yOtn2IiWmYnlKMNZXVExP6tHaa+nl85v4Wnf6UWubaqHJ1+vlfsjbLc2juhW6irnmXzsjWPbdsoZVq+VxyycHbqjRYczRLNJk0CzU/BiJDHbiRccttqtNkmQNlWF3+hCK8YQ/mqN72HM+C8Se5lxRb9R/WcXhFF5HsOj2hDx4ek6uyh7Y860zfrUk92yEV0EifyVcZWdW5bLrH4rmJVrjNrp5Zsj5Fte5bHqVrZnz0vb7Vyf9ZUdK6tfeV9rPpV973TOwtnx5myAOkP+0IRcFHrBi5ww5cRWw9AJRMe9674VYwh/eYtMi2UmHntxJ/KyC1uLT2lHVoYdpxbXts8uxxlf9XSP+LI3BvI6wqelPi0bj5ZX6pY5R8TBaJ4o9UToYMcsfaTrStmu96zwWzQXoGWXNtp1YCQfKptyj9ZXxi91LmXe9ZyFs+NZRJA6w37XhA7ils52An6nROKkllTQCTSh2qVuaflLDNEFI2vUyIKYjcWeDaJ7NvaO0F/ZXin5Z32lttb2tXld67+y/WgbV8hbHVPZeeX5LasrmpvVQ+yL/CEcWoeRvINc86zt4iPr30ie9fxatiH1lbFLnUt5M+di/4eNv2GLhbPjXVSgOkN/1zRbHNnBWhPeTkJ7T+a4tsCiJ2VGtyvd04sxRGz0ZCiv7OJTiwUdV/eZ2GjFs46r+8z4eq/sVy4AVs7scdZPPbk72Y/MVdbulo2z8WPl6HF0bmj/0T06FqK5wuqJ5qbMbAy0/Ca6oDn05Kn9aLlqu46vbDN+0THsHq3vSH62ekSO1f9RX0TGRPdh4ewQRQWrM/R3TRog3zVOnNQCDSmnnOCqLqLQ07EeYd+LMYTPejKUc8Z3I4kzM77oVos11Vv2CE4ROVbmWce6mCLl13IGUsbIWEfbmI3Nlk1HMD27EELLt8zUJ7atxnulHjWZiJxjxy7tHLHfjtM6Rs+r6NrS0ql2TXXdOS+zcHa8tzIoSnHoie8FG3Kie+OLTTrZS/t47hOIxJgmEH+Efmu0uM3IKZN9S5tsjEcYZcdWfUfs0HvO2M/aWdO5Np9r/Ve2H23jCnlHxVNmznq+E33fvvnt+VI0XyDXExFsmek6Yts8vbUN7cOIXKTMkvmo/cqhtdcxW32i10p9o/dF+ynbSO6PjrmiHwtnh+rRTlsd2MhEV1tokTY4LrldU42jNRTBtCdHE5WVGzkemSPZ+Isk6az+amNkodS+Z+5RhZK1YSfbZ/1o7bLHNRtXyevNN6tb9jg7nzx5Mo9l+/OP379d7s1tNDtlpvmu5rNvCpoDJAsZticbbbuVp2PbNmNq6lDHTN1c3NSLi6L78KnqirR/WIngDSycHVCrA6QUiZ78pf7I8TXJlTZo0ivbR86lUHqU7eevC1bLXoTfylgo5WmyKtt757U4qN2XKfwihXNmXKvjqB323qOOsz5q6bfT4rTCPrG9FT+zceOxPYopkpfmhzLXaHtpJ1K2jK3MdFw9L+W2zpG+bMWM6ICUZW2dsb/GRsesXY+295hEx+n1E7aWSa//mddZODv0a0nD6QprQhSeqkwZ6GVS1H6Zfa3QQEzSUu+Mfne7ZzZR9xJRJu4yfsrIEV/W4k2uzcZ1xg6Re+SGmFeevi2uXv+VbbMxXtOtFvtXZ4rkZeOgnE8eP6RsHV/9kZ2P2dxSixvLxPZRPW3bzLHK0XGVx8yYei+CifjD/rMZHXvFXhkokxUykGOycHZonlE4l0nLUWuoyU5C5Ni1wNbAH1Ky6JxNnMUwtzqdTYA9ppmF0MZWFHY2PlpzMTum6pyxQ+89aj/rf0/Pneye9aFnn7S1bMzEfE2OtrfkaR/UHqm/l8+tT8Qu2d69f4J/g4XIVlm9PNVih1zfRE4t5yC5a7wg7LdshIV+jZ9tjx6LHz58+lwwf/b3UZsyUCZHyZ2Rw8LZoVebOE5XaJMGEGpQtQOZWLxEK/oidJ9Jnihmu42D8B3aZxpXI6yydrSS6WxRWeMyYtfKvog5Veq30xxbYZ/aW/PtKpk1eaoPao/UvxULSDme7TKv//r48du71ZmcYsdF6utxQY5vc5oW44j4yeRYsVW2o54sW5/JsXK1TMo+O56zcHa8MjuJnSHDTbPFgBWkCSAzoew49rg2wREyVF8rj8fz79XV4lmT1ijjWgz0xtFFotfPXm/FRGY8Hbs1rvY5ez9jX033XRaobOzV7LLtLRuvzhSpf2QOiJ9k02/esJyzx+IfWzS3/DUiA7l2Wp3Qsar5U/Ut87OspbK9fvXqmZMct/4ZiPSPPmUWn8t2VqH8LNz8kHiOxKG5ZYtDFs6OG8pAdrosa0IUoFY5sUU2+1fT9vrosU768j6U3rXxS3mPdK4JNmuzXQTsGJlxZ5JcRp7o68XE7GJWY2L5nHk8a5+n+y42o3LFqI0rmIoOXnx6us22ofUfiQdkwS68NBeM6BDhh9RTdVsxpvpSZahtykXPvb0Wv3Lt9dciu+ynfeS1C/mQIlur+C7vP+JcbT1q/iBtYuHs0DyzcBZ1dFI5qqWaxJ7VhbMohkgwZ7NPAV5802yhUSt2M/4qE/2I6dm49mIiO5bq642p13bYZ3zT03uHBWo2lmdsXMF0Zj70bCmvz8Z8OV5Ud6RckSmbPMGOyi/1bp2vjq+W7N41zcPKs7Rf23vjeNdl7F2eInv6lW1qa8mg7LfrOQtnxzM7LKorkrxj6nBTa/HVT5DDg5obdmBv1NniELEYlH7TxDVq4Ix/snZ4yXV2fpQ8Rjms7J/1TUsnj2Gr/6prmiNkoa89LcvKbtmYjb2eLkfG0WzMl7ZEdEfGovhHNimatYgsdUKdI/VG6dSzP6KzcNPNmz8q48g/7lN9onu1szVfo2Od1Y+Fs0N+pjhwhks1rUr0KWXMTa1kq4ui6T58uDqhDiu0yQ2zbMuY1uQ1al7L/5GxMou/FxOZcVS/3RP2jG1qY7mf9Vs5XuZcY1gXd/R7s61iIRvvLTuPjCO0/lHdkbEoOUh/81nmoxbn7DVh9tPLl/APaBl9hLd9r7tmv84RK0OLZftEORIPUR9bWauPta7xcvpq2cjxWTg7NGtB7XRd2uRNoqUCA4O3FmCdFIFhql2uPqGqhk1emI2FkmtmvHKMjEkZuSLHxl1k0Wjptsv89nSctc0bc4cFVO0SXWRDFs0yXs+n2biTsWubjclaH0S7skOMpWNEdEfKFb+rz4+OR7FDNpWvDI7cC2/9EBKxX9ZS2WrvJUfjWXL20V8v1+KqDCLx1xrn7GssnB0P9JKwc8uSJkQhilasFfAofXfhj2Y3M94s27Lo1QQ2olMk4ffGyy7GNiayY6hurRjWPmftM35p6YrwWWv8yDX1l+pyho1nyIywifRRfpG+kT5lLqjdg2ImfpdNCleNgZrMI9oll8o3VpSb/hGdtOuT8bJP5nyF/aO+2YG7Fvs2l2d47nAPC2fHCzs5Fp00HXOHmnpFx+iE9oRHE7t37+o28Yf8+m9mi/y7bW98TTzetUib+i4bU4h5kf0AYGXPxNgOC0jNV1m/1MaT9rPtVZt0Tut5S+fRaxrXrftmYsYb18ajdx3VtoJXJCaQckWeFM0aAyg2q8ZB2y56Iu2f0e+ouC19ozpHYq+8d8dzFs6OV84KLkeV56bZgqk2bqa9t0ihdO3JyeiOuGd2AZ5JHLNsNa41iY3yQPkkw1AX3WzhrbbO8NcxVu0zXFq6nG2rxpn6Ts9bOo9ei9iIlqv2jOqa6Y/WXXSIzGNULAor/SM2zT8ZDkfeg7JddLb2R7hH7JzR78jYVVs0hiNzVe/Zfc/C2fHQbhN8tlhwTEw39SY/StfdfCDANAGk4X2+cSZ5zLLVpJkpwPXeGdv13ox8uVdib9YHvfhVHY/ez9rl6TsTa954I21qj42bmQXfkx21T3Xxxsi0ReVmxrb3oPWWsSO6o+SKLP3jvIhca/tZxyjbS/1R9iP0s3Oy1BN9rvqi7Efrlx2PhbNDbseiLVtsOOZNNUUKD9QCGZE1ZczgzQi7Zm2a0UETZmYMZOLTZDqI//kPwKL/IcsbG2mDN/5MW5ZJTeaZtlpbNN5tW03n0XYdu3cfWnZUbk+v3nW03iKvpztKpuQa+aM05CsKPV6z12cfTNTkI+diJnd7eula4F1DtWksHSELpXN0HBbODqkdC2dREzVpHJPDTb3EKwPphAkPWumITDgVEeFmhE0Ie2Y/QEkS01+dho3/3BGhu8rLLlAyL2f+aAdpg9qC2qPn9lm22nmiedS2oXiN2IeUPyJ3xlakzqpHRPfZ/KKy7D6yZtj+Zx2fxTxqL1q/lX6xOX6lnCg7dD8Wzg5RTfjOpVOb0BMnY0xkEthJk5Fh79nBFyjukYXL2u4dI9l649faIn6v3eu1owtFT0bZhrahHD97joovK/8MW60ddt6ifT06j6xellHmeFR2Robcg9RZxovojZYZlSv9zt5W2C42Iecheh7ZOYrkb9eoVTKQ+mbGYuHsUNvZ2SueCDgIqk3RRIDSc4df86ASVpRdFf7XCyh9enL0+gofoOJDdeztI4VDb4xV19EszrDVFh42f9p2FL/ReYTkOyo7Y/NZzNB55Yw4zPCWe9C2y5hI+1fEBFI/sVc3ZWnzgF67y56Fs+PJnR1uP805qi9vii4caD3P8glq0UUmKZRO0WBB6q4yVywEOra3X2GDJyfTpgtN5l7vnugc9e7NtFlf2nlq2zPjevdk/IjSIyPbs6HXho6HiN4oRta2o+PQyh45XmF7hHlUxxX6iWykjmqLrk02D+i1O+1ZODve3N3pqyaSg+KHppFkqJPoh0GSDUf7Bcl5hFsPD/pDSU/eigR7tA1I/j1eI9fRHFb4qmWPnSPl/DyjAPR0RTE+gq3l6dky2hbVeRdfjdqH6I+2XXRC5hv0OqrMorGh/Xt71RM9bk/uGddZODvUywXA6XJ6kwbp0YqMJATUgmVtPGpSIvmidV7B1TIuj0d8Xt7bOl+xYHnyVrxq4snJtKELpVW+8myzupc5017z7s20ZW1DzZes/KitK5iVfvF0QctF5ztPZ1Qb2nbRC2n/Cv2UXSQ2tG9vr+sl0vaezDOvs3B26CMDyhke0oRaDEaVGV08Vkz8lZNTuM585ZnHc5SZN0bZpomqbEefryw6j7JhZbzM8kbOjyPttL4r8yXSJuU7YxsiV66cB2oj+oNk6ReVY/crfLUi31mdUccrbJ+JU88udExYGSg/aS5A22513e2YhbPjkUjCcW47vEkD9kjBmcm2Sk/kRF1RMItfkDpaP69I+nZ8PV6lv4x/lA07z2ckg5W+0niw80SKyXdPTy8+fN7bDb3YI+ya1Qmhg2VUHiPjQMaOxjxa7mpOJbeZ89mY8GRn1kdvHGlDfOCrjY3yk67tqPFq+u7WzsLZ8Ug06Ti3Htq0cmLVDMkkhtV6ygIuX7b/7v1TTe0f2kUn2dBPl62glclkNVO14w42ZGJW7V+914UHIWe1nTbmak9g0YWYcEHYNct55TxAM4uuX2i5Kxkh5ocdA227jI22f4WOygChq84pxFiq11X2LJwdT0UTj3Pr4U0rJ5dnTHYRO1pPWdhlk4JaNvnXr7pl/gGI3juyz7KKytDEFe2f6bfahhVPfayduyd1pA9X+srO3xpT28f6YOa4Jmt0TFv0j94r/VetCbN6lbaM8ELPvZXxV9o5e462fYR7VHdkbihlzvpKdVthd6nrjucsnB2vrEqSjihIkwYxZLDOIDMT7kg9O2Ysv3xEQlnNs/ZUEQlvtQ27z2WU/St9ZQviVlzvXozM6LcqjlD+lznZ8k05Z61Py2uZ8xHZmfGR96BtF91m1sWabcjYsDJmfaV6zY5jdbraMQtnx2OrkqQjCtKEfmrRUmo2QcwsXi29drp2VEJZ7fcj7FixiNlYmI1XO9aKY5T9KwpniS/7KlMrL6LssIzRvtMF38qIHqN1EblIZqNzFZmHV8Re1C+j/ZDMVfYoe72vt5+J19bYWX1tPsiO0dLrStdYODveai0QTvctmlZNstI4xAJylK6l7kecH51QkAtgyecIW1YW/0foXzIbPUfZjy5e7ByVsb0/AlRbr1KMzLBG5D3lJXsUs55vrEw9RsnW8a4wz1RXG9faNrNHzzurC1pXHTsTy3buXLE+UttRexbODsmrBsbKIkoxZSad3mv36ORtxz7r+IwFZFVyFYYoX/f8sSpuz/BHz9byul2Qymsj56gFvNQnwhDtv4jMETa2b2mfvdY6Rs4FVO7LcMraX2OT0aE21up2FHer50r7V+T2jL7KLfMhzbK60zELZ8ebVy2c0UnRQQMtpnRCenKu1pZJSAgbV/kcVYhFbFyxQIhcZLETsSPbB1V4ztgrcWRfy4gukivm8IwdER9kdEatCRnZnk1ZfVDyVafVvlI5iD1qnqkuq3P+irw4qrPqcOR6oHx33rNwdryTTUrOUIc3aaCvEoxOlOhEvsru1rhnxwt6QRBbRxNsi0/v2ooYOFL/nn296yj7MzaXBbPoGo1nlN6WT8YGe3/0eDRPRpm05CN4zRQwCPnWvqN8ZWVmj9G2ix7otbC0bcVDkWgcW9lX8nPJcNU5C2eHbDS4nFtPb7IBv0KZFcliRVJbYXs5ZvSpXHkf+ny0CIjIPzJZrojZI/WP8Oz1QX34ic5PYW6fMIt+o0UZSmdlc7TPRvLO7JowO0cRuQbtr2isqX/P2l85v6B9FoljOy8i/c/y65lyWTg79K8eLDbwHfOmmlYmy5V6Txld3IxYxIohp05XLAwr/ewZi14gjtbfs2mkDRn7UoD+9fHjt//oJ/Eh2+tXr759n7n9LvNMPCP1VU5n+Cxqx+iHCrXJ+4Ci1yL7jG+8caN2evd6bUd/yPF0iLahbRe5R8UqOre3/GY5ZeM96pOr92Ph7Hjw6oWzmDT7hMPB8tx0RMKwE7imx1ntrcRzlk7o5HpG0kTG644+isQGkkFEnnCyBXbkHumDjjcZ80yfRfPN6LowwwlVMAtb2R71g2nUt18oxX4eHatoG1R/iU/Z7G+e0HEXI3q9XiycHZ+NJkhniNObZpJ2S/kjCmeVj04YOu7oXpLJ6L/0HpUx2x9ZdGlindVp5H6kr8/Qf8TWWl+Zs3YRq/WbbZ/lg4w1sWVWn1keen8kBiO6zvhxReESsUsZRPYRBpFxjuiD/sBwlu1oH3rsz7LN02X3NhbOjofuUDiLWegFTsY8snAWebII6a+Y7a+X5drqbcUitkpn5AelMxIoUv+jYxTtU/QiKXEsW+u7mKM2oHUTubv5S2z86aXknS9P5Eo2Mj/KJ/USv7JlPvhonpH7P3z1lRwjttq80pgoZcgDgnITW+2G1tGOjTyuxeqM7aLfWfb34jLDTmPvLJsyOu9wz60K5x2AUoe1BCR5yPb2zW9wQZpQEQUGXDkO+HAEagt/BIQuiNIXtSjWirCIPrU+Z3xIq+nita/IN8wzHmm2RQnMxiTjL0q63o+Fc50Nr2xOQBOIqClPiGSrPSV6vmh+aPKQJhbKBgwPtyMgBav81sVuEu/6dNA+EUQVyVaWHqN/g7V70ax26770g+YcuW7zjs0tR/tIdeX+MQjU1sAyBo/KEY9B/cULFs6P4ukHtFMWOrutLCqsHB6TwN0IyAKN/i3PXV6Ju5uvaQ8JkECbAAvnNh9eJQESIIGHJvCIr2g8tMNpPAmQQJMAC+cmHl4kARIggccmgH5FQ36N/PMvvz42VFpPAiRwWQIsnC/rOipOAiSwkoC+6qPvF9v3ikVu+c0KK3U5a2y+onEWecolARLYlQAL5109Q71IgAQOJSCFsnydmGz2j72iSsiTVPvHYFd/p35F0Xy1PwiM+p79SIAEHocAC+fH8TUtJQESKAhosZwplIuh3FMpFGV79/7Jvb5zI/qfR/AVjZ29Td1IgASiBFg4R0mxHwmQwG0IIAtm/eonfdoskPSrymxBLkX0VV7vWPG0ebd/dHKbYKYhJEAChxJg4XwobgojARI4kwC6YI58B7jI1P9+Gel/Jh+RvaJo5isaZ3uV8kmABFAEWDijSHIcEiCBrQmgCsK7v3KAfkWDRfPW04LKkQAJDBJg4TwIjN1JgASuRwBVNN+9CERx0gi5+4cMtZN7EiCBxyHAwvlxfE1LSeAhCaC+h5hF83j48L3mcWa8gwRIYG8CLJz39g+1IwESmCDAojkGT97D/vOP32Odg73u/kEjiIHdSIAEbkaAhfPNHEpzSIAEvhBAvXbwCAUg6gOGxt4jMFNbuScBEngsAiycH8vftJYEHoIAqmgWWHcvApGshBffaxYK3EiABO5KgIXzXT1Lu0jggQmgvhmCRfN4EPG95nFmvIMESOA6BFg4X8dX1JQESCBAAPkE9c6FM99rDgQTu5AACZBAQYCFcwGEpyRAAtcmwKfNMf+hOKm0O3/IUBu5JwESIAEWzowBEiCB2xBAPm2+8ysHSE4SPCyabzOFaAgJkECHAAvnDiBeJgESuA4B5FPUuxbOLJqvE8/UlARIYD8CLJz38wk1IgESSBJAFc53fYLKojkZWLyNBEiABL4SYOHMUCABErgFAeQfu92xcEbykYC5I6NbTAQaQQIksJQAC+eleDk4CZDAUQSQheG///Lriw8fPx2l+iFykP/khEXzIS6jEBIggQ0JsHDe0ClUiQRIYJwA8jWEuxXOSDYsmsdjk3eQAAnchwAL5/v4kpaQwEMTQBaHd/rDQCQXFs0PPcVoPAmQwGcCLJwZBiRAArcggHxV4y6FM7JovttT+FsEPY0gARI4nAAL58ORUyAJkMAKAiycv6eKKpr/+vyu97unp9u98/09LZ6RAAmQQIwAC+cYJ/YiARK4AAHU19Fd/Ykz6kMEX824QNBTRRIggUMJsHA+FDeFkQAJrCSAKpyv/FoCi+aVEcaxSYAEHp0AC+dHjwDaTwI3IoD6yrWrFs6oovmq9t8olGkKCZDApgRYOG/qGKpFAiQwTuCRC0eE7XyfeTzmeAcJkMBjEWDh/Fj+prUkcHsCiNc1pID8+fM/QbnKhiqar2TzVXxDPUmABO5FgIXzvfxJa0jg4Qkgvk3iSoUzomjmqxkPP20IgARIIEiAhXMQFLuRAAlchwDiqfMVvllj9kMCvzXjOjFNTUmABPYgwMJ5Dz9QCxIgASCB2YJSVNm9qJyxke8yA4ONQ5EACTwUARbOD+VuGksCj0Ng9hs2dn5dY6Zo3v0DweNEKC0lARK4IgEWzlf0GnUmARIIEZgtnnd791feZ3775s2L15/3oxufMo8SY38SIAES+JEAC+cfmbCFBEjgJgRm/3Bup6fOWVtYMN8kmGkGCZDAFgRYOG/hBipBAiSwikC24FR9diieM69msGBWD3JPAiRAAjgCLJxxLDkSCZDAxgQyxaeac9Z7wZlXM1gwq9e4JwESIAE8ARbOeKYckQRIYFMCVymeWTBvGkBUiwRI4OEJsHB++BAgABJ4LAJSlL5+9erzH9n9Nmz4EU+eR4p7ebr84dOnF+/ePw3bwhtIgARIgATGCbBwHmfGO0iABG5AYKRAteZK8SwbslgdecIsxfKz/KenFx++Hj838AcJkAAJkMByAiyclyOmABIggZ0JSAEt2+gTaCmg//r4MV28SrH8RW7/6+X0vWXpz2L5GRt/kAAJkMApBFg4n4KdQkmABHYkMFNEiz1lIa3Fsdoqr4j89FJeFWl/D7N9qiz3slhWgtyTAAmQwLkEWDify5/SSYAENiaghXSk2M2aoUWyvKtcFt7ZMXkfCZAACZDAGgIsnNdw5agkQAI3JaB/XFiaJ8V1a5PCWDYpjnXjk2QlwT0JkAAJXIMAC+dr+IlakgAJkAAJkAAJkAAJnEyAhfPJDqB4EiABEiABEiABEiCBaxBg4XwNP1FLEiABEiABEiABEiCBkwmwcD7ZARRPAiRAAiRAAiRAAiRwDQIsnK/hJ2pJAiRAAiRAAiRAAiRwMgEWzic7gOJJgARIgARIgARIgASuQYCF8zX8RC1JgARIgARIgARIgAROJsDC+WQHUDwJkAAJkAAJkAAJkMA1CLBwvoafqCUJkAAJkAAJkAAJkMDJBFg4n+wAiicBEiABEiABEiABErgGARbO1/ATtSQBEiABEiABEiABEjiZAAvnkx1A8SRAAiRAAiRAAiRAAtcgwML5Gn6iliRAAiRAAiRAAiRAAicTYOF8sgMongRIgARIgARIgARI4BoEWDhfw0/UkgRIgARIgARIgARI4GQCLJxPdgDFkwAJkAAJkAAJkAAJXIMAC+dr+IlakgAJkAAJkAAJkAAJnEyAhfPJDqB4EiABEiABEiABEiCBaxBg4XwNP1FLEiABEiABEiABEiCBkwmwcD7ZARRPAiRAAiRAAiRAAiRwDQIsnK/hJ2pJAiRAAiRAAiRAAiRwMgEWzic7gOJJgARIgARIgARIgASuQYCF8zX8RC1JgARIgARIgARIgAROJsDC+WQHUDwJkAAJkAAJkAAJkMA1CLBwvoafqCUJkAAJkAAJkAAJkMDJBFg4n+wAiicBEiABEiABEiABErgGARbO1/ATtSQBEiABEiABEiABEjiZAAvnkx1A8SRAAiRAAiRAAiRAAtcgwML5Gn6iliRAAiRAAiRAAiRAAicT+H8ko9Lz0g6UuAAAAABJRU5ErkJggg==";

  return (
    <div style={{background:"#F7F8FA",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 24px 48px",fontFamily:"Georgia, serif"}}>

      {/* PAGE HEADER */}
      <div style={{width:"100%",maxWidth:860,marginBottom:36,display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
        <img src={`data:image/png;base64,${LOGO}`} alt="Beloved New York" style={{height:80,marginBottom:12,objectFit:"contain"}}/>
        <p style={{color:"#64748B",fontSize:13,fontFamily:"Calibri, sans-serif",margin:0,letterSpacing:1}}>
          Monthly &amp; Quarterly Giving Analysis &nbsp;·&nbsp; Aug 2025 – Jun 2026 &nbsp;·&nbsp; 98 unique donors &nbsp;·&nbsp; 683 transactions
        </p>
      </div>

      {/* ── SECTION 1: GIVING ── */}
      <SectionHeader eyebrow="Section 1" title="Monthly Giving" subtitle="Recurring vs. One-Time contributions"/>
      <div style={{width:"100%",maxWidth:860,background:"#fff",borderRadius:12,boxShadow:"0 2px 16px rgba(0,0,0,0.08)",padding:"28px 16px 16px"}}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={givingData.map(d=>({...d,total:d.recurring+d.oneTime}))} margin={{top:24,right:20,left:10,bottom:0}} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#64748B",fontSize:11,fontFamily:"Calibri, sans-serif"}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>v===0?"$0":`$${v/1000}k`} domain={[0,50000]} ticks={[0,10000,20000,30000,40000,50000]} tick={{fill:"#64748B",fontSize:11,fontFamily:"Calibri, sans-serif"}} axisLine={false} tickLine={false} width={44}/>
            <Tooltip content={<GivingTooltip/>} cursor={{fill:"rgba(15,31,61,0.04)"}}/>
            <Legend wrapperStyle={{fontFamily:"Calibri, sans-serif",fontSize:12,paddingTop:12}} formatter={v=><span style={{color:"#475569"}}>{v}</span>}/>
            <Bar dataKey="recurring" name="Recurring" stackId="a" fill="#0F1F3D" radius={[0,0,0,0]}/>
            <Bar dataKey="oneTime"   name="One-Time"  stackId="a" fill="#C49A3C" radius={[4,4,0,0]}>
              <LabelList dataKey="total" content={<GivingTopLabel/>}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{width:"100%",maxWidth:860,marginTop:8}}>
        <p style={{color:"#64748B",fontSize:10,fontFamily:"Calibri, sans-serif",fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"12px 0 8px"}}>Rolling 3-Month Average (Apr – Jun '26)</p>
      </div>
      <div style={{width:"100%",maxWidth:860,display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:12}}>
        <KpiCard label="3-Mo Avg · Total Giving"  value={r3Total}     note={r3Label} accent="#0F1F3D"/>
        <KpiCard label="3-Mo Avg · Recurring"      value={r3Recurring} note={r3Label} accent="#1A3260"/>
        <KpiCard label="3-Mo Avg · One-Time"       value={r3OneTime}   note={r3Label} accent="#C49A3C"/>
        <KpiCard label="3-Mo Avg · Avg Gift Size"  value={r3Avg}       note={r3Label} accent="#028090"/>
        <KpiCard label="3-Mo Avg · Median Gift"    value={r3Median}    note={r3Label} accent="#028090"/>
      </div>

      {/* Avg / Median line chart */}
      <div style={{width:"100%",maxWidth:860,marginTop:20}}>
        <p style={{color:"#64748B",fontSize:10,fontFamily:"Calibri, sans-serif",fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"0 0 8px"}}>Average &amp; Median Gift Size Per Month (ex. Aug outlier)</p>
      </div>
      <div style={{width:"100%",maxWidth:860,background:"#fff",borderRadius:12,boxShadow:"0 2px 16px rgba(0,0,0,0.08)",padding:"20px 16px 12px"}}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={givingData.slice(1)} margin={{top:10,right:20,left:10,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#64748B",fontSize:11,fontFamily:"Calibri, sans-serif"}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>`$${v}`} tick={{fill:"#64748B",fontSize:11,fontFamily:"Calibri, sans-serif"}} axisLine={false} tickLine={false} width={44}/>
            <Tooltip
              content={({active, payload, label}) => {
                if (!active || !payload?.length) return null;
                const avg    = payload.find(p=>p.dataKey==="avg");
                const median = payload.find(p=>p.dataKey==="median");
                return (
                  <div style={{background:"#0F1F3D",border:"1px solid #C49A3C",borderRadius:10,padding:"12px 16px",minWidth:200,boxShadow:"0 8px 24px rgba(0,0,0,0.35)"}}>
                    <p style={{color:"#E8C472",fontWeight:700,margin:"0 0 10px",fontSize:14,fontFamily:"Georgia, serif"}}>{label}</p>
                    {avg && (
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:10,height:3,background:"#0F1F3D",border:"1px solid #fff",borderRadius:1}}/>
                          <span style={{color:"#94A3B8",fontSize:11,fontFamily:"Calibri, sans-serif"}}>Avg Gift</span>
                        </div>
                        <span style={{color:"#fff",fontSize:13,fontWeight:700,fontFamily:"Georgia, serif",marginLeft:16}}>${avg.value.toFixed(2)}</span>
                      </div>
                    )}
                    {median && (
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:10,height:2,background:"#C49A3C",borderRadius:1}}/>
                          <span style={{color:"#94A3B8",fontSize:11,fontFamily:"Calibri, sans-serif"}}>Median Gift</span>
                        </div>
                        <span style={{color:"#C49A3C",fontSize:13,fontWeight:700,fontFamily:"Georgia, serif",marginLeft:16}}>${median.value.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{fontFamily:"Calibri, sans-serif",fontSize:12,paddingTop:8}} formatter={v=><span style={{color:"#475569"}}>{v}</span>}/>
            <Line type="monotone" dataKey="avg"    name="Avg Gift"    stroke="#0F1F3D" strokeWidth={2} dot={{r:3,fill:"#0F1F3D"}}/>
            <Line type="monotone" dataKey="median" name="Median Gift" stroke="#C49A3C" strokeWidth={2} dot={{r:3,fill:"#C49A3C"}} strokeDasharray="4 2"/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Divider/>

      {/* ── SECTION 2: GIVERS ── */}
      <SectionHeader eyebrow="Section 2" title="Monthly Unique Givers" subtitle="New (first gift ever) vs. Active (gave in a prior month) · 98 total donors on file"/>
      <div style={{width:"100%",maxWidth:860,background:"#fff",borderRadius:12,boxShadow:"0 2px 16px rgba(0,0,0,0.08)",padding:"28px 16px 16px"}}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={giverData.map(d=>({...d,total:d.newGivers+d.active}))} margin={{top:24,right:20,left:10,bottom:0}} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#64748B",fontSize:11,fontFamily:"Calibri, sans-serif"}} axisLine={false} tickLine={false}/>
            <YAxis domain={[0,50]} ticks={[0,10,20,30,40,50]} tick={{fill:"#64748B",fontSize:11,fontFamily:"Calibri, sans-serif"}} axisLine={false} tickLine={false} width={32} allowDecimals={false}/>
            <Tooltip content={<GiverTooltip/>} cursor={{fill:"rgba(15,31,61,0.04)"}}/>
            <Legend wrapperStyle={{fontFamily:"Calibri, sans-serif",fontSize:12,paddingTop:12}} formatter={v=><span style={{color:"#475569"}}>{v==="newGivers"?"New Givers":"Active Givers"}</span>}/>
            <Bar dataKey="active"    name="active"    stackId="b" fill="#028090" radius={[0,0,0,0]}/>
            <Bar dataKey="newGivers" name="newGivers" stackId="b" fill="#C49A3C" radius={[4,4,0,0]}>
              <LabelList dataKey="total" content={<CountTopLabel/>}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{width:"100%",maxWidth:860,marginTop:8}}>
        <p style={{color:"#64748B",fontSize:10,fontFamily:"Calibri, sans-serif",fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"12px 0 8px"}}>Rolling 3-Month Average (Apr – Jun '26)</p>
      </div>
      <div style={{width:"100%",maxWidth:860,display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:12}}>
        <KpiCard label="3-Mo Avg · Total Unique Givers" value={r3TotalG.toFixed(1)} note={r3Label} accent="#0F1F3D" isCount/>
        <KpiCard label="3-Mo Avg · Active Givers"       value={r3Active.toFixed(1)} note={r3Label} accent="#028090" isCount/>
        <KpiCard label="3-Mo Avg · New Givers"          value={r3New.toFixed(1)}    note={r3Label} accent="#C49A3C" isCount/>
      </div>

      <Divider/>

      {/* ── SECTION 3: DONATIONS ── */}
      <SectionHeader eyebrow="Section 3" title="Total Donations per Month" subtitle="Total individual transactions · excludes canceled"/>
      <div style={{width:"100%",maxWidth:860,background:"#fff",borderRadius:12,boxShadow:"0 2px 16px rgba(0,0,0,0.08)",padding:"28px 16px 16px"}}>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={donationData.map(d=>({...d,total:d.recurring+d.oneTime}))} margin={{top:24,right:20,left:10,bottom:0}} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#64748B",fontSize:11,fontFamily:"Calibri, sans-serif"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#64748B",fontSize:11,fontFamily:"Calibri, sans-serif"}} axisLine={false} tickLine={false} width={32} allowDecimals={false}/>
            <Tooltip content={<DonationTooltip/>} cursor={{fill:"rgba(15,31,61,0.04)"}}/>
            <Legend wrapperStyle={{fontFamily:"Calibri, sans-serif",fontSize:12,paddingTop:12}} formatter={v=><span style={{color:"#475569"}}>{v==="recurring"?"Recurring":"One-Time"}</span>}/>
            <Bar dataKey="recurring" name="recurring" stackId="c" fill="#0F1F3D" radius={[0,0,0,0]}/>
            <Bar dataKey="oneTime"   name="oneTime"   stackId="c" fill="#C49A3C" radius={[4,4,0,0]}>
              <LabelList dataKey="total" content={<CountTopLabel/>}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{width:"100%",maxWidth:860,marginTop:8}}>
        <p style={{color:"#64748B",fontSize:10,fontFamily:"Calibri, sans-serif",fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"12px 0 8px"}}>Rolling 3-Month Average (Apr – Jun '26)</p>
      </div>
      <div style={{width:"100%",maxWidth:860,display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:12}}>
        <KpiCard label="3-Mo Avg · Total Donations"     value={r3DonTotal.toFixed(1)}     note={r3Label} accent="#0F1F3D" isCount/>
        <KpiCard label="3-Mo Avg · Recurring Donations" value={r3DonRecurring.toFixed(1)} note={r3Label} accent="#1A3260" isCount/>
        <KpiCard label="3-Mo Avg · One-Time Donations"  value={r3DonOneTime.toFixed(1)}   note={r3Label} accent="#C49A3C" isCount/>
      </div>

      <Divider/>

      {/* ── SECTION 4: GIVING ANALYSIS ── */}
      <SectionHeader
        eyebrow="Section 4"
        title="Monthly Giving Analysis"
        subtitle="Key drivers behind each month's giving movement · tap a row to expand"
      />
      <div style={{width:"100%",maxWidth:860,background:"#fff",borderRadius:12,boxShadow:"0 2px 16px rgba(0,0,0,0.08)",overflow:"hidden"}}>
        {/* Table header */}
        <div style={{display:"grid",gridTemplateColumns:"110px 90px 72px 52px 1fr",background:"#0F1F3D",padding:"10px 16px",gap:8}}>
          {["Month","Total Giving","MoM Change","Full Svcs","Key Driver"].map(h=>(
            <span key={h} style={{color:"#E8C472",fontSize:9,fontWeight:700,fontFamily:"Calibri, sans-serif",letterSpacing:1.5,textTransform:"uppercase"}}>{h}</span>
          ))}
        </div>
        {/* Rows */}
        {givingData.map((d,i)=>{
          const total     = d.recurring+d.oneTime;
          const prev      = i>0?givingData[i-1]:null;
          const prevTotal = prev?prev.recurring+prev.oneTime:null;
          const change    = pct(total,prevTotal);
          const isPos     = change&&change.startsWith("+");
          const ins       = insights[i];
          const isOpen    = expandedMonth===i;

          return (
            <div key={d.month} style={{borderBottom:"1px solid #F1F5F9"}}>
              <div
                onClick={()=>setExpandedMonth(isOpen?null:i)}
                style={{display:"grid",gridTemplateColumns:"110px 90px 72px 52px 1fr",padding:"10px 16px",gap:8,cursor:"pointer",background:isOpen?"#EFF6FF":i%2===0?"#fff":"#F7F8FA",alignItems:"center"}}
              >
                <span style={{color:"#0F1F3D",fontSize:12,fontWeight:700,fontFamily:"Georgia, serif"}}>{d.month}</span>
                <span style={{color:"#0F1F3D",fontSize:12,fontFamily:"Georgia, serif"}}>{fmtKpi(total)}</span>
                <span style={{fontSize:11,fontWeight:700,color:!change||change==="—"?"#94A3B8":isPos?"#16A34A":"#DC2626",fontFamily:"Calibri, sans-serif"}}>{change||"—"}</span>
                <span style={{color: d.fullSundays < d.sundays ? "#D97706" : "#475569", fontSize:12, fontFamily:"Calibri, sans-serif", textAlign:"center", fontWeight: d.fullSundays < d.sundays ? 700 : 400}}>
                  {d.fullSundays}{d.fullSundays < d.sundays ? ` / ${d.sundays}` : ""}
                </span>
                <span style={{color:"#C49A3C",fontSize:11,fontWeight:700,fontFamily:"Calibri, sans-serif"}}>{ins.driver} {isOpen?"▲":"▼"}</span>
              </div>
              {isOpen&&(
                <div style={{background:"#EFF6FF",padding:"10px 16px 14px",borderTop:"1px solid #BFDBFE"}}>
                  <p style={{color:"#1E3A6E",fontSize:12,fontFamily:"Calibri, sans-serif",margin:0,lineHeight:1.6}}>{ins.note}</p>
                  {d.sundayNote && (
                    <div style={{marginTop:8,padding:"6px 10px",background:"#FEF3C7",borderLeft:"3px solid #D97706",borderRadius:4}}>
                      <span style={{color:"#92400E",fontSize:11,fontFamily:"Calibri, sans-serif",fontWeight:700}}>⚠ Service exceptions: </span>
                      <span style={{color:"#92400E",fontSize:11,fontFamily:"Calibri, sans-serif"}}>{d.sundayNote}</span>
                    </div>
                  )}
                  <div style={{display:"flex",gap:24,marginTop:10}}>
                    <div>
                      <p style={{color:"#64748B",fontSize:9,fontFamily:"Calibri, sans-serif",textTransform:"uppercase",letterSpacing:1,margin:"0 0 2px"}}>Avg Gift</p>
                      <p style={{color:"#0F1F3D",fontSize:13,fontWeight:700,fontFamily:"Georgia, serif",margin:0}}>{fmtDollarFull(d.avg)}</p>
                    </div>
                    <div>
                      <p style={{color:"#64748B",fontSize:9,fontFamily:"Calibri, sans-serif",textTransform:"uppercase",letterSpacing:1,margin:"0 0 2px"}}>Median Gift</p>
                      <p style={{color:"#0F1F3D",fontSize:13,fontWeight:700,fontFamily:"Georgia, serif",margin:0}}>{fmtDollarFull(d.median)}</p>
                    </div>
                    <div>
                      <p style={{color:"#64748B",fontSize:9,fontFamily:"Calibri, sans-serif",textTransform:"uppercase",letterSpacing:1,margin:"0 0 2px"}}>Recurring</p>
                      <p style={{color:"#0F1F3D",fontSize:13,fontWeight:700,fontFamily:"Georgia, serif",margin:0}}>{fmtKpi(d.recurring)}</p>
                    </div>
                    <div>
                      <p style={{color:"#64748B",fontSize:9,fontFamily:"Calibri, sans-serif",textTransform:"uppercase",letterSpacing:1,margin:"0 0 2px"}}>One-Time</p>
                      <p style={{color:"#0F1F3D",fontSize:13,fontWeight:700,fontFamily:"Georgia, serif",margin:0}}>{fmtKpi(d.oneTime)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
