"use client";

import { useMemo, useRef, useState } from "react";
import { encodeQr, qrToSvg, ECC_LABEL, MAX_BYTES, type QrEcc, type QrResult } from "./qr";

type ContentType = "text" | "wifi" | "email" | "sms" | "phone";

function escapeWifi(s: string): string {
  return s.replace(/([\\;,:"])/g, "\\$1");
}

function buildPayload(
  type: ContentType,
  text: string,
  ssid: string,
  wifiPass: string,
  wifiAuth: string,
  wifiHidden: boolean
): string {
  switch (type) {
    case "wifi": {
      const auth = wifiAuth === "nopass" ? "nopass" : wifiAuth;
      return `WIFI:T:${auth};S:${escapeWifi(ssid)};${auth === "nopass" ? "" : `P:${escapeWifi(wifiPass)};`}H:${wifiHidden ? "true" : "false"};;`;
    }
    case "email":
      return text.startsWith("mailto:") ? text : `mailto:${text}`;
    case "sms":
      return text.startsWith("sms:") ? text : `sms:${text}`;
    case "phone":
      return text.startsWith("tel:") ? text : `tel:${text}`;
    default:
      return text;
  }
}

const CONTENT_LABELS: Record<ContentType, string> = {
  text: "Text / URL",
  wifi: "Wi-Fi",
  email: "Email",
  sms: "SMS",
  phone: "Phone",
};

export default function QrToolClient() {
  const [type, setType] = useState<ContentType>("text");
  const [text, setText] = useState("https://yatools.vercel.app");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiAuth, setWifiAuth] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [ecc, setEcc] = useState<QrEcc>("M");
  const [px, setPx] = useState(512);
  const [fg, setFg] = useState("#141210");
  const [bg, setBg] = useState("#ffffff");
  const [copied, setCopied] = useState(false);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  const payload = useMemo(
    () => buildPayload(type, text.trim(), ssid.trim(), wifiPass, wifiAuth, wifiHidden),
    [type, text, ssid, wifiPass, wifiAuth, wifiHidden]
  );

  const qr: { ok: true; data: QrResult } | { ok: false; error: string } = useMemo(() => {
    if (!payload) return { ok: false, error: "Enter some content to generate a QR code." };
    const byteLen = new TextEncoder().encode(payload).length;
    if (byteLen > MAX_BYTES[ecc]) {
      return {
        ok: false,
        error: `Too long for ${ECC_LABEL[ecc]} error correction (${byteLen}/${MAX_BYTES[ecc]} bytes). Shorten the text or pick a lower correction level.`,
      };
    }
    try {
      return { ok: true, data: encodeQr(payload, ecc) };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Could not encode QR code." };
    }
  }, [payload, ecc]);

  const svg = useMemo(
    () => (qr.ok ? qrToSvg(qr.data, fg, bg) : null),
    [qr, fg, bg]
  );

  const downloadPng = () => {
    if (!qr.ok) return;
    const n = qr.data.size;
    const quiet = 4;
    const scale = px / (n + quiet * 2);
    const canvas = document.createElement("canvas");
    canvas.width = px;
    canvas.height = px;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = fg;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.data.modules[r][c]) {
          ctx.fillRect(
            Math.round((c + quiet) * scale),
            Math.round((r + quiet) * scale),
            Math.ceil(scale),
            Math.ceil(scale)
          );
        }
      }
    }
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `yatools-qr-${px}px.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "yatools-qr.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        {/* Controls */}
        <div>
          <label className="neu-label" htmlFor="qr-type">Content type</label>
          <select
            id="qr-type"
            className="neu-select"
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            style={{ marginBottom: 16 }}
          >
            {(Object.keys(CONTENT_LABELS) as ContentType[]).map((t) => (
              <option key={t} value={t}>{CONTENT_LABELS[t]}</option>
            ))}
          </select>

          {type === "wifi" ? (
            <>
              <label className="neu-label" htmlFor="qr-ssid">Network name (SSID)</label>
              <input
                id="qr-ssid"
                className="neu-input neu-input-mono"
                style={{ marginBottom: 16 }}
                placeholder="MyWiFi"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="neu-label" htmlFor="qr-auth">Security</label>
                  <select
                    id="qr-auth"
                    className="neu-select"
                    value={wifiAuth}
                    onChange={(e) => setWifiAuth(e.target.value)}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
                <div>
                  <label className="neu-label" htmlFor="qr-hidden">Hidden network</label>
                  <select
                    id="qr-hidden"
                    className="neu-select"
                    value={wifiHidden ? "yes" : "no"}
                    onChange={(e) => setWifiHidden(e.target.value === "yes")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              {wifiAuth !== "nopass" && (
                <>
                  <label className="neu-label" htmlFor="qr-wpass">Password</label>
                  <input
                    id="qr-wpass"
                    type="password"
                    className="neu-input neu-input-mono"
                    style={{ marginBottom: 16 }}
                    placeholder="Wi-Fi password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    autoComplete="off"
                  />
                </>
              )}
            </>
          ) : (
            <>
              <label className="neu-label" htmlFor="qr-text">
                {type === "text" ? "Text or URL" : type === "email" ? "Email address" : type === "sms" ? "Phone number" : "Phone number"}
              </label>
              <textarea
                id="qr-text"
                className="neu-textarea neu-input-mono"
                style={{ minHeight: 110, marginBottom: 16 }}
                placeholder={type === "text" ? "https://example.com" : type === "email" ? "hello@example.com" : "+92 300 1234567"}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label className="neu-label" htmlFor="qr-ecc">Error correction</label>
              <select
                id="qr-ecc"
                className="neu-select"
                value={ecc}
                onChange={(e) => setEcc(e.target.value as QrEcc)}
              >
                {(Object.keys(ECC_LABEL) as QrEcc[]).map((k) => (
                  <option key={k} value={k}>{ECC_LABEL[k]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="neu-label" htmlFor="qr-size">Download size</label>
              <select
                id="qr-size"
                className="neu-select"
                value={px}
                onChange={(e) => setPx(Number(e.target.value))}
              >
                <option value={256}>256 px</option>
                <option value={512}>512 px</option>
                <option value={1024}>1024 px</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
            <div>
              <label className="neu-label" htmlFor="qr-fg">Code color</label>
              <input
                id="qr-fg"
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                style={{ width: "100%", height: 46, border: "2.5px solid var(--ink)", borderRadius: 11, background: "var(--surface)", cursor: "pointer", padding: 4 }}
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="qr-bg">Background</label>
              <input
                id="qr-bg"
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                style={{ width: "100%", height: 46, border: "2.5px solid var(--ink)", borderRadius: 11, background: "var(--surface)", cursor: "pointer", padding: 4 }}
              />
            </div>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            Keep strong contrast (dark on light) so every phone camera scans it first try.
          </p>
        </div>

        {/* Preview */}
        <div>
          <p className="neu-label">Live preview</p>
          <div
            ref={svgWrapRef}
            className="result-box"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, background: "var(--surface)" }}
          >
            {qr.ok && svg ? (
              <div
                dangerouslySetInnerHTML={{ __html: svg }}
                style={{ width: "min(100%, 320px)", lineHeight: 0 }}
                role="img"
                aria-label="Generated QR code"
              />
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", textAlign: "center", padding: 20 }}>
                {qr.ok ? "" : qr.error}
              </p>
            )}
          </div>
          {qr.ok && (
            <p className="font-mono2" style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 10 }}>
              Version {qr.data.version} · {qr.data.size}×{qr.data.size} modules · {ECC_LABEL[ecc]} correction ·
              {" "}{new TextEncoder().encode(payload).length} bytes
            </p>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button type="button" className="neu-btn neu-btn-primary neu-btn-sm" onClick={downloadPng} disabled={!qr.ok}>
              Download PNG
            </button>
            <button type="button" className="neu-btn neu-btn-sm" onClick={downloadSvg} disabled={!qr.ok}>
              Download SVG
            </button>
            <button type="button" className="neu-btn neu-btn-sm" onClick={copyPayload} disabled={!payload}>
              {copied ? "Copied!" : "Copy content"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
