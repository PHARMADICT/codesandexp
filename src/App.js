import { useState, useRef, useCallback } from "react";

/* ══════════════════════════════════════════
GLOBAL STYLES
══════════════════════════════════════════ */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#060810}
    .app{font-family:'Nunito',sans-serif;background:#060810;min-height:100vh;color:#dde2f0;max-width:430px;margin:0 auto}
    .rms{font-family:'Bebas Neue',sans-serif;letter-spacing:.03em}

    @keyframes slideUp{
      from{transform:translateY(72px) scale(0.88);opacity:0}
      to{transform:translateY(0) scale(1);opacity:1}
    }
    @keyframes rowIn{
      from{opacity:0;transform:translateX(-14px)}
      to{opacity:1;transform:translateX(0)}
    }
    @keyframes pulseScan{
      0%{transform:scale(1);box-shadow:0 0 0 0 rgba(74,222,128,.65)}
      55%{transform:scale(1.12);box-shadow:0 0 0 16px rgba(74,222,128,0)}
      100%{transform:scale(1)}
    }
    @keyframes blinkWarn{0%,100%{opacity:1}50%{opacity:.45}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
    @keyframes ripple{
      0%{transform:scale(0.9);opacity:.8}
      100%{transform:scale(1.7);opacity:0}
    }

    .card-in{animation:slideUp .44s cubic-bezier(.175,.885,.32,1.275) both}
    .row-in{opacity:0;animation:rowIn .28s ease forwards}
    .pulse{animation:pulseScan .65s ease}
    .blink{animation:blinkWarn 1.4s ease infinite}
    .fade-up{animation:fadeUp .22s ease forwards}

    .press{transition:transform .13s cubic-bezier(.34,1.56,.64,1),filter .1s}
    .press:active{transform:scale(.94) translateY(1.5px);filter:brightness(.85)}

    .scanbar:focus-within{border-color:rgba(74,222,128,.55)!important;box-shadow:0 0 0 3px rgba(74,222,128,.08)!important}
    .inp{background:none;border:none;outline:none;width:100%;font-family:'Nunito',sans-serif;font-size:12px;font-weight:600;color:#dde2f0}
    .inp::placeholder{color:#2a3550}
    ::-webkit-scrollbar{width:0}
  `}</style>
);

/* ══════════════════════════════════════════
MASTER DATABASE
══════════════════════════════════════════ */
const MASTER = [
  {
    barcode: "4008500109427",
    rms: "DRM-001",
    gtin: "04008500109427",
    description: "BEPANTHEN OINTMENT 30G",
    brand: "BEPANTHEN",
    classification: "Dermatology",
    supplier: "Bayer Consumer Health",
    returnStatus: "Returnable",
  },
  {
    barcode: "3574661298658",
    rms: "SKN-002",
    gtin: "03574661298658",
    description: "AVEENO SKIN RELIEF OIL 300ML",
    brand: "AVEENO",
    classification: "Dermatology",
    supplier: "J&J Consumer Inc",
    returnStatus: "Non-Returnable",
  },
  {
    barcode: "6291100080069",
    rms: "ANL-003",
    gtin: "06291100080069",
    description: "ADOL 500MG CAPLETS 24S",
    brand: "ADOL",
    classification: "Analgesics",
    supplier: "Julphar Gulf Pharma",
    returnStatus: "Returnable",
  },
  {
    barcode: "6281086010259",
    rms: "ANL-004",
    gtin: "06281086010259",
    description: "SAPOFEN 400MG TABS 20S",
    brand: "SAPOFEN",
    classification: "Analgesics",
    supplier: "Al Jazeera Pharma",
    returnStatus: "Returnable",
  },
  {
    barcode: "2961544500143",
    rms: "ANL-005",
    gtin: "02961544500143",
    description: "PANADOL NIGHT TABLETS 24S",
    brand: "PANADOL",
    classification: "Analgesics",
    supplier: "Haleon FZE",
    returnStatus: "Non-Returnable",
  },
  {
    barcode: "5000168014939",
    rms: "VIT-006",
    gtin: "05000168014939",
    description: "CENTRUM ADVANCE ADULTS 30S",
    brand: "CENTRUM",
    classification: "Vitamins",
    supplier: "Pfizer Consumer Health",
    returnStatus: "Returnable",
  },
  {
    barcode: "4005808156054",
    rms: "BBY-007",
    gtin: "04005808156054",
    description: "NIVEA BABY SOFT CREAM 200ML",
    brand: "NIVEA BABY",
    classification: "Baby Care",
    supplier: "Beiersdorf AG",
    returnStatus: "Non-Returnable",
  },
  {
    barcode: "6154000305478",
    rms: "ALG-008",
    gtin: "06154000305478",
    description: "CLARITYNE 10MG TABS 10S",
    brand: "CLARITYNE",
    classification: "Allergy",
    supplier: "Organon UAE LLC",
    returnStatus: "Returnable",
  },
  {
    barcode: "4007920003015",
    rms: "SKN-009",
    gtin: "04007920003015",
    description: "EUCERIN INTENSIVE LOTION 250ML",
    brand: "EUCERIN",
    classification: "Dermatology",
    supplier: "Beiersdorf Medical",
    returnStatus: "Returnable",
  },
  {
    barcode: "7310100054495",
    rms: "OTC-010",
    gtin: "07310100054495",
    description: "NICORETTE GUM 2MG 30S",
    brand: "NICORETTE",
    classification: "OTC",
    supplier: "Kenvue ME FZE",
    returnStatus: "Non-Returnable",
  },
];

const CLR = {
  Dermatology: { a: "#f97316", bg: "#180e05", lt: "#fed7aa" },
  Analgesics: { a: "#3b82f6", bg: "#05101e", lt: "#bfdbfe" },
  Vitamins: { a: "#22c55e", bg: "#051405", lt: "#bbf7d0" },
  "Baby Care": { a: "#ec4899", bg: "#17050f", lt: "#fbcfe8" },
  Allergy: { a: "#06b6d4", bg: "#041315", lt: "#a5f3fc" },
  OTC: { a: "#a855f7", bg: "#0e061b", lt: "#e9d5ff" },
  default: { a: "#6366f1", bg: "#08091b", lt: "#c7d2fe" },
};

/* ══════════════════════════════════════════
GS1 STRICT PARSER
══════════════════════════════════════════ */
const AI = {
  "00": { n: "sscc", l: 18, f: true },
  "01": { n: "gtin", l: 14, f: true },
  "02": { n: "content", l: 14, f: true },
  10: { n: "batch", l: 20, f: false },
  11: { n: "prodDate", l: 6, f: true },
  12: { n: "dueDate", l: 6, f: true },
  13: { n: "packDate", l: 6, f: true },
  15: { n: "bestBefore", l: 6, f: true },
  17: { n: "expiry", l: 6, f: true },
  20: { n: "variant", l: 2, f: true },
  21: { n: "serial", l: 20, f: false },
  22: { n: "cpv", l: 29, f: false },
  30: { n: "qty", l: 8, f: false },
  37: { n: "qty", l: 8, f: false },
  310: { n: "netWt", l: 6, f: true },
  320: { n: "netWt", l: 6, f: true },
};

function fmtDate(raw) {
  if (!raw || raw.length !== 6) return null;
  const yy = parseInt(raw.slice(0, 2));
  const mm = raw.slice(2, 4),
    dd = raw.slice(4, 6);
  const yr = yy > 50 ? 1900 + yy : 2000 + yy;
  const day = dd === "00" ? "01" : dd;
  return {
    disp: `${day}/${mm}/${yr}`,
    date: new Date(yr, parseInt(mm) - 1, parseInt(day)),
  };
}

function applyAI(res, ai, raw) {
  const def = AI[ai];
  if (!def) return;
  const v = raw.trim();
  switch (def.n) {
    case "gtin":
      res.gtin = v;
      break;
    case "batch":
      res.batch = v;
      break;
    case "serial":
      res.serial = v;
      break;
    case "qty":
      res.qty = v;
      break;
    case "expiry":
    case "bestBefore":
    case "dueDate": {
      const d = fmtDate(v);
      if (d) {
        res.expiry = d.disp;
        res.expiryDate = d.date;
      }
      break;
    }
    case "prodDate":
    case "packDate": {
      const d = fmtDate(v);
      if (d) res.prodDate = d.disp;
      break;
    }
    default:
      if (!res[def.n]) res[def.n] = v;
  }
}

function parseSegment(seg, res) {
  let pos = 0;
  while (pos < seg.length) {
    let hit = false;
    for (const alen of [3, 2]) {
      if (pos + alen > seg.length) continue;
      const ai = seg.slice(pos, pos + alen);
      const def = AI[ai];
      if (!def) continue;
      if (def.f) {
        const end = pos + alen + def.l;
        if (end <= seg.length) {
          applyAI(res, ai, seg.slice(pos + alen, end));
          pos = end;
          hit = true;
          break;
        }
      } else {
        applyAI(res, ai, seg.slice(pos + alen, pos + alen + def.l));
        pos = seg.length;
        hit = true;
        break;
      }
    }
    if (!hit) break;
  }
}

function parseGS1(raw) {
  if (!raw?.trim()) return {};
  const res = {};
  const s = raw.trim();

  if (/(\d{2,3})/.test(s)) {
    const re = /\((\d{2,3})\)([^(]*)/g;
    let m;
    while ((m = re.exec(s)) !== null)
      applyAI(res, m[1], m[2].replace(/[\x1d\n\r]/g, ""));
    return res;
  }

  if (s.includes("\x1d")) {
    s.split("\x1d")
      .filter(Boolean)
      .forEach((g) => parseSegment(g, res));
    return Object.keys(res).length ? res : { rmsEntry: s.replace(/\x1d/g, "") };
  }

  parseSegment(s, res);
  if (Object.keys(res).length) return res;

  const c = s.replace(/\s/g, "");
  if (/^\d{14}$/.test(c)) {
    res.gtin = c;
    return res;
  }
  if (/^\d{13}$/.test(c)) {
    res.gtin = "0" + c;
    return res;
  }
  if (/^\d{8,12}$/.test(c)) {
    res.gtin = c;
    return res;
  }

  res.rmsEntry = c;
  return res;
}

/* ══════════════════════════════════════════
HELPERS
══════════════════════════════════════════ */
const norm = (g) => (g || "").replace(/^0+/, "") || g;

function lookup(parsed) {
  if (parsed.gtin) {
    const n = norm(parsed.gtin);
    return (
      MASTER.find((p) => norm(p.gtin) === n || norm(p.barcode) === n) || null
    );
  }
  if (parsed.rmsEntry) {
    return (
      MASTER.find(
        (p) => p.rms.toUpperCase() === parsed.rmsEntry.toUpperCase()
      ) || null
    );
  }
  return null;
}

function expStatus(d) {
  if (!d) return null;
  const days = Math.ceil((d - Date.now()) / 86400000);
  if (days < 0) return { s: "expired", label: "EXPIRED", c: "#ef4444" };
  if (days <= 90) return { s: "warn", label: `${days}d left`, c: "#f59e0b" };
  if (days <= 180)
    return { s: "soon", label: `${Math.ceil(days / 30)}mo left`, c: "#a3e635" };
  return { s: "ok", label: `${Math.ceil(days / 30)}mo left`, c: "#4ade80" };
}

function exportCSV(scans) {
  const H = [
    "Time",
    "Input",
    "RMS",
    "GTIN",
    "Description",
    "Brand",
    "Classification",
    "Supplier",
    "Return Status",
    "Batch",
    "Serial",
    "Expiry",
  ];
  const rows = scans.map((s) =>
    [
      new Date(s.ts).toLocaleString(),
      s.raw,
      s.product?.rms || "",
      s.product?.gtin || "",
      s.product?.description || "NOT FOUND",
      s.product?.brand || "",
      s.product?.classification || "",
      s.product?.supplier || "",
      s.product?.returnStatus || "",
      s.parsed.batch || "",
      s.parsed.serial || "",
      s.parsed.expiry || "",
    ]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(",")
  );
  const blob = new Blob([[H.join(","), ...rows].join("\n")], {
    type: "text/csv",
  });
  Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: `pharmastock-${Date.now()}.csv`,
  }).click();
}

/* ══════════════════════════════════════════
RESULT CARD
══════════════════════════════════════════ */
function ResultCard({ scan, onClose }) {
  const { product, parsed } = scan;
  const C = CLR[product?.classification] || CLR.default;
  const exp = expStatus(parsed.expiryDate);
  const isReturn = product?.returnStatus === "Returnable";

  const rows = [
    { k: "GTIN", v: product?.gtin || parsed.gtin },
    { k: "BRAND", v: product?.brand },
    { k: "CLASS", v: product?.classification },
    { k: "SUPPLIER", v: product?.supplier },
    { k: "BATCH", v: parsed.batch, hi: true },
    { k: "SERIAL", v: parsed.serial },
    { k: "EXPIRY", v: parsed.expiry, isExp: true },
    { k: "PROD DATE", v: parsed.prodDate },
  ].filter((r) => r.v);

  return (
    <div
      className="card-in press"
      style={{
        background: `linear-gradient(155deg, ${C.bg} 0%, #060810 100%)`,
        border: `1.5px solid ${C.a}22`,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 14,
        position: "relative",
      }}
    >
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg,${C.a},${C.a}35)`,
        }}
      />
      <div style={{ padding: "15px 15px 13px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 13 }}>
          <div
            style={{
              background: C.a,
              borderRadius: 12,
              padding: "7px 10px",
              minWidth: 84,
              textAlign: "center",
              flexShrink: 0,
              boxShadow: `0 4px 18px ${C.a}40`,
            }}
          >
            <div
              className="rms"
              style={{ fontSize: 21, color: "#fff", lineHeight: 1 }}
            >
              {product?.rms || "???"}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: ".05em",
                background: "rgba(0,0,0,.28)",
                borderRadius: 4,
                padding: "2px 5px",
                color: isReturn ? "#fff" : "rgba(255,255,255,.75)",
              }}
            >
              {isReturn ? "↩ RETURNABLE" : "⊘ NO RETURN"}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#edf0fb",
                lineHeight: 1.25,
                marginBottom: 4,
              }}
            >
              {product?.description || (
                <span style={{ color: "#ef4444" }}>⚠ NOT IN MASTER</span>
              )}
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.lt,
                opacity: 0.7,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product?.supplier || `Input: ${scan.raw.slice(0, 22)}`}
            </div>
          </div>

          <button
            onClick={onClose}
            className="press"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "none",
              borderRadius: "50%",
              width: 26,
              height: 26,
              color: "#445",
              fontSize: 16,
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "sans-serif",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {rows.map((row, i) => (
            <div
              key={row.k}
              className="row-in"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                animationDelay: `${i * 42}ms`,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: C.a,
                  minWidth: 56,
                  letterSpacing: ".1em",
                  flexShrink: 0,
                }}
              >
                {row.k}
              </span>
              <div
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  className={row.isExp && exp && exp.s !== "ok" ? "blink" : ""}
                  style={{ color: row.isExp && exp ? exp.c : "#b0bcd5" }}
                >
                  {row.v}
                </span>
                {row.isExp && exp && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 900,
                      color: exp.c,
                      background: `${exp.c}1a`,
                      borderRadius: 5,
                      padding: "1px 6px",
                    }}
                  >
                    {exp.label}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {product && (
          <div
            style={{
              marginTop: 13,
              padding: "7px 12px",
              borderRadius: 9,
              background: isReturn
                ? "rgba(34,197,94,.1)"
                : "rgba(239,68,68,.08)",
              border: `1px solid ${
                isReturn ? "rgba(34,197,94,.22)" : "rgba(239,68,68,.18)"
              }`,
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 11,
              fontWeight: 800,
              color: isReturn ? "#4ade80" : "#f87171",
            }}
          >
            <span style={{ fontSize: 14 }}>{isReturn ? "↩" : "⊘"}</span>
            {product.returnStatus.toUpperCase()}
            {!isReturn && (
              <span style={{ fontWeight: 600, opacity: 0.6, marginLeft: 4 }}>
                — Do not accept returns
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
RECENT ROW
══════════════════════════════════════════ */
function RecentRow({ scan, onClick }) {
  const { product, parsed } = scan;
  const C = CLR[product?.classification] || CLR.default;
  const exp = expStatus(parsed.expiryDate);
  return (
    <div
      onClick={onClick}
      className="press"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "10px 13px",
        borderBottom: "1px solid rgba(255,255,255,.03)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 9,
          flexShrink: 0,
          background: product ? C.a : "#1a2030",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 2px 10px ${product ? C.a + "30" : "#0003"}`,
        }}
      >
        <span className="rms" style={{ fontSize: 11, color: "#fff" }}>
          {product ? product.rms.split("-").pop() : "??"}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#cdd4e6",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product?.description || (
            <span style={{ color: "#ef444470" }}>
              Not found: {scan.raw.slice(0, 16)}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#2e3a50",
            fontWeight: 500,
            marginTop: 1,
          }}
        >
          {[product?.brand, product?.supplier].filter(Boolean).join(" · ")}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {parsed.expiry && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: exp?.c || "#4ade80",
              letterSpacing: "-.01em",
            }}
          >
            {parsed.expiry}
          </div>
        )}
        {parsed.batch && (
          <div style={{ fontSize: 9, color: "#1e2a3a", fontWeight: 600 }}>
            #{parsed.batch}
          </div>
        )}
      </div>
    </div>
  );
}

const DEMOS = [
  { label: "EAN-13", val: "4008500109427", hint: "Bepanthen" },
  {
    label: "GS1 ()",
    val: "(01)06291100080069(17)261231(10)LOT2024B",
    hint: "Adol + expiry + batch",
  },
  {
    label: "GS1 Raw",
    val: "010628108601025917260101102024BATCH99",
    hint: "Sapofen raw",
  },
  { label: "RMS", val: "VIT-006", hint: "Centrum by RMS" },
  {
    label: "Expired",
    val: "(01)02961544500143(17)230601(10)OLDLOT01",
    hint: "Panadol expired",
  },
];

/* ══════════════════════════════════════════
MAIN APP
══════════════════════════════════════════ */
export default function PharmaStockPro() {
  const [input, setInput] = useState("");
  const [scans, setScans] = useState([]);
  const [card, setCard] = useState(null);
  const [pulsing, setPulsing] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef();

  const process = useCallback((raw) => {
    const v = (raw || "").trim();
    if (!v) return;
    const parsed = parseGS1(v);
    const product = lookup(parsed);
    const rec = { id: Date.now(), ts: Date.now(), raw: v, parsed, product };
    setCard({ ...rec, _k: Date.now() });
    setScans((prev) => [rec, ...prev.slice(0, 99)]);
    setInput("");
    setPulsing(true);
    setTimeout(() => setPulsing(false), 700);
    if (!product) {
      setErr("Product not in master — check GTIN, barcode or RMS");
      setTimeout(() => setErr(""), 3000);
    } else setErr("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const warnCount = scans.filter((s) => {
    const e = expStatus(s.parsed.expiryDate);
    return e && e.s !== "ok";
  }).length;

  return (
    <div className="app">
      <G />

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "linear-gradient(180deg,#0b0f20 0%,#060810 100%)",
          borderBottom: "1px solid rgba(255,255,255,.04)",
          padding: "18px 15px 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".2em",
                color: "#1c2c50",
                marginBottom: 1,
              }}
            >
              PHARMASTOCK
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
              Pro <span style={{ color: "#4ade80" }}>Scanner</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            {warnCount > 0 && (
              <div
                style={{
                  background: "rgba(245,158,11,.1)",
                  border: "1px solid rgba(245,158,11,.22)",
                  borderRadius: 20,
                  padding: "4px 10px",
                  fontSize: 9,
                  fontWeight: 800,
                  color: "#fbbf24",
                }}
              >
                ⚠ {warnCount} expiring
              </div>
            )}
            {scans.length > 0 && (
              <button
                onClick={() => exportCSV(scans)}
                className="press"
                style={{
                  background: "rgba(74,222,128,.08)",
                  border: "1px solid rgba(74,222,128,.18)",
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 9,
                  fontWeight: 800,
                  color: "#4ade80",
                  cursor: "pointer",
                }}
              >
                ↓ CSV
              </button>
            )}
          </div>
        </div>

        <div
          className="scanbar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            background: "#0c1522",
            border: "1.5px solid rgba(74,222,128,.16)",
            borderRadius: 13,
            padding: "3px 3px 3px 12px",
            transition: "border-color .3s, box-shadow .3s",
          }}
        >
          <span
            style={{
              color: "#4ade80",
              opacity: 0.55,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            ⊡
          </span>
          <input
            ref={inputRef}
            value={input}
            autoFocus
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && process(input)}
            placeholder="Scan barcode, GS1 string or RMS code…"
            className="inp"
          />
          <button
            onClick={() => process(input)}
            className={`press ${pulsing ? "pulse" : ""}`}
            style={{
              background: "#4ade80",
              border: "none",
              borderRadius: 10,
              padding: "9px 14px",
              fontSize: 11,
              fontWeight: 900,
              color: "#061a0c",
              cursor: "pointer",
              letterSpacing: ".04em",
              flexShrink: 0,
            }}
          >
            SCAN
          </button>
        </div>

        {err && (
          <div
            className="fade-up"
            style={{
              marginTop: 7,
              fontSize: 10,
              fontWeight: 700,
              color: "#f87171",
              background: "rgba(239,68,68,.07)",
              border: "1px solid rgba(239,68,68,.16)",
              borderRadius: 7,
              padding: "5px 10px",
            }}
          >
            ⚠ {err}
          </div>
        )}

        {scans.length > 0 && (
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            {[
              ["Scanned", scans.length],
              ["Unique", new Set(scans.map((s) => s.product?.rms)).size],
              ["Not Found", scans.filter((s) => !s.product).length],
            ].map(([l, v]) => (
              <div key={l} style={{ fontSize: 10 }}>
                <span
                  style={{ fontWeight: 800, color: "#4ade80", marginRight: 3 }}
                >
                  {v}
                </span>
                <span style={{ color: "#1e2d45", fontWeight: 600 }}>{l}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "13px 13px 80px" }}>
        {card && (
          <ResultCard key={card._k} scan={card} onClose={() => setCard(null)} />
        )}

        {!scans.length && !card && (
          <div>
            <div
              style={{
                textAlign: "center",
                padding: "38px 16px 22px",
                color: "#151e30",
              }}
            >
              <div style={{ fontSize: 46, marginBottom: 10, opacity: 0.5 }}>
                ⊡
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#233045",
                  marginBottom: 5,
                }}
              >
                Ready to scan
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.7, color: "#141d2e" }}>
                Supports EAN-13 · GS1 with parentheses · GS1 raw · RMS code
                <br />
                Expiry &amp; batch parsed automatically from GS1
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: ".14em",
                  color: "#1c2a40",
                  marginBottom: 7,
                }}
              >
                TRY THESE
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {DEMOS.map((d) => (
                  <button
                    key={d.val}
                    onClick={() => process(d.val)}
                    className="press"
                    style={{
                      background: "#0c1522",
                      border: "1px solid rgba(255,255,255,.06)",
                      borderRadius: 9,
                      padding: "7px 11px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        color: "#4ade80",
                        letterSpacing: ".06em",
                      }}
                    >
                      {d.label}
                    </span>
                    <span
                      style={{ fontSize: 9, color: "#2a3a55", fontWeight: 600 }}
                    >
                      {d.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                background: "#0a1020",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.04)",
                padding: "12px 13px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: ".12em",
                  color: "#1c2a40",
                  marginBottom: 9,
                }}
              >
                GS1 APPLICATION IDENTIFIERS PARSED
              </div>
              {[
                ["(01)", "GTIN — 14 digits"],
                ["(17)", "Expiry date — YYMMDD"],
                ["(10)", "Batch/Lot number"],
                ["(21)", "Serial number"],
                ["(11)", "Production date"],
                ["(30)", "Quantity"],
              ].map(([ai, desc]) => (
                <div
                  key={ai}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 5,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#4ade8055",
                      minWidth: 36,
                    }}
                  >
                    {ai}
                  </span>
                  <span
                    style={{ fontSize: 10, color: "#1e2c40", fontWeight: 600 }}
                  >
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {scans.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: ".14em",
                color: "#1c2a40",
                marginBottom: 6,
                marginTop: card ? 14 : 0,
              }}
            >
              RECENT SCANS
            </div>
            <div
              style={{
                background: "#0c1020",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.04)",
                overflow: "hidden",
              }}
            >
              {scans.slice(0, 30).map((s) => (
                <RecentRow
                  key={s.id}
                  scan={s}
                  onClick={() => setCard({ ...s, _k: Date.now() })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
