"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  encodeQr,
  qrToStyledSvg,
  drawQrToCanvas,
  contrastRatio,
  ECC_LABEL,
  MAX_BYTES,
  type QrEcc,
  type QrResult,
  type QrDotStyle,
  type QrEyeStyle,
} from "./qr";

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

const DOT_STYLES: { id: QrDotStyle; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
];

const EYE_STYLES: { id: QrEyeStyle; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "circle", label: "Circle" },
];

const PNG_SIZES = [512, 1024, 2048];

export default function QrToolClient() {
  /* ---- content ---- */
  const [type, setType] = useState<ContentType>("text");
  const [text, setText] = useState("https://yatools.vercel.app");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiAuth, setWifiAuth] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  /* ---- design ---- */
  const [ecc, setEcc] = useState<QrEcc>("M");
  const [dotStyle, setDotStyle] = useState<QrDotStyle>("square");
  const [eyeStyle, setEyeStyle] = useState<QrEyeStyle>("square");
  const [fg, setFg] = useState("#141210");
  const [bg, setBg] = useState("#ffffff");
  const [quiet, setQuiet] = useState(4);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [pngPx, setPngPx] = useState(1024);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const payload = useMemo(
    () => buildPayload(type, text.trim(), ssid.trim(), wifiPass, wifiAuth, wifiHidden),
    [type, text, ssid, wifiPass, wifiAuth, wifiHidden]
  );

  // A center logo covers part of the code — Low correction can't survive it,
  // so we auto-bump to Medium and say so.
  const effectiveEcc: QrEcc = logoUrl && ecc === "L" ? "M" : ecc;
  const eccBumped = effectiveEcc !== ecc;

  const qr: { ok: true; data: QrResult } | { ok: false; error: string } = useMemo(() => {
    if (!payload) return { ok: false, error: "Enter some content to generate a QR code." };
    const byteLen = new TextEncoder().encode(payload).length;
    if (byteLen > MAX_BYTES[effectiveEcc]) {
      return {
        ok: false,
        error: `Too long for ${ECC_LABEL[effectiveEcc]} error correction (${byteLen}/${MAX_BYTES[effectiveEcc]} bytes). Shorten the text or pick a lower correction level.`,
      };
    }
    try {
      return { ok: true, data: encodeQr(payload, effectiveEcc) };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Could not encode QR code." };
    }
  }, [payload, effectiveEcc]);

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const lowContrast = ratio < 3;

  // Live canvas preview (rendered at 960px internally, scaled by CSS).
  useEffect(() => {
    if (!qr.ok || !previewRef.current) return;
    drawQrToCanvas(previewRef.current, qr.data, 960, {
      fg,
      bg,
      quiet,
      dotStyle,
      eyeStyle,
      logo: logoImg,
    });
  }, [qr, fg, bg, quiet, dotStyle, eyeStyle, logoImg]);

  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  const pickLogo = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setLogoImg(img);
      setLogoUrl(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  };

  const removeLogo = () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoUrl(null);
    setLogoImg(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const styleOpts = { fg, bg, quiet, dotStyle, eyeStyle, logo: logoImg };

  const downloadPng = () => {
    if (!qr.ok) return;
    const canvas = document.createElement("canvas");
    drawQrToCanvas(canvas, qr.data, pngPx, styleOpts);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `yatools-qr-${pngPx}px.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!qr.ok) return;
    const svg = qrToStyledSvg(qr.data, { ...styleOpts, logo: null, logoDataUrl: logoUrl });
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

  const segBtn = (active: boolean): React.CSSProperties => ({
    flex: "1 1 0",
    padding: "9px 6px",
    borderRadius: 10,
    border: "2.5px solid var(--ink)",
    background: active ? "var(--red)" : "var(--surface)",
    color: active ? "#fff" : "var(--text)",
    fontWeight: 700,
    fontSize: "0.82rem",
    cursor: "pointer",
    boxShadow: active ? "3px 3px 0 var(--ink)" : "none",
  });

  return (
    <div className="neu-card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {/* ------- Controls ------- */}
        <div>
          <p className="neu-label" style={{ marginBottom: 8 }}>Content</p>
          <label className="neu-label" htmlFor="qr-type" style={{ fontSize: "0.68rem" }}>Content type</label>
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
                {type === "text" ? "Text or URL" : type === "email" ? "Email address" : "Phone number"}
              </label>
              <textarea
                id="qr-text"
                className="neu-textarea neu-input-mono"
                style={{ minHeight: 100, marginBottom: 16 }}
                placeholder={type === "text" ? "https://example.com" : type === "email" ? "hello@example.com" : "+92 300 1234567"}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </>
          )}

          <p className="neu-label" style={{ marginBottom: 8, marginTop: 4 }}>Design</p>

          <span className="neu-label" style={{ fontSize: "0.68rem" }}>Dot style</span>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }} role="group" aria-label="Dot style">
            {DOT_STYLES.map((d) => (
              <button
                key={d.id}
                type="button"
                style={segBtn(dotStyle === d.id)}
                aria-pressed={dotStyle === d.id}
                onClick={() => setDotStyle(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <span className="neu-label" style={{ fontSize: "0.68rem" }}>Corner eyes</span>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }} role="group" aria-label="Corner eye style">
            {EYE_STYLES.map((d) => (
              <button
                key={d.id}
                type="button"
                style={segBtn(eyeStyle === d.id)}
                aria-pressed={eyeStyle === d.id}
                onClick={() => setEyeStyle(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label className="neu-label" htmlFor="qr-fg" style={{ fontSize: "0.68rem" }}>
                Code color <span className="font-mono2">{fg}</span>
              </label>
              <input
                id="qr-fg"
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                style={{ width: "100%", height: 44, border: "2.5px solid var(--ink)", borderRadius: 11, background: "var(--surface)", cursor: "pointer", padding: 4 }}
              />
            </div>
            <div>
              <label className="neu-label" htmlFor="qr-bg" style={{ fontSize: "0.68rem" }}>
                Background <span className="font-mono2">{bg}</span>
              </label>
              <input
                id="qr-bg"
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                style={{ width: "100%", height: 44, border: "2.5px solid var(--ink)", borderRadius: 11, background: "var(--surface)", cursor: "pointer", padding: 4 }}
              />
            </div>
          </div>
          {lowContrast && (
            <div className="notice" style={{ borderColor: "var(--red)", marginBottom: 12, padding: "10px 14px" }}>
              <strong>Low contrast ({ratio.toFixed(1)}:1).</strong> This may not scan reliably —
              dark modules on a light background work best. Avoid inverted (light-on-dark) codes.
            </div>
          )}

          <label className="neu-label" htmlFor="qr-quiet" style={{ fontSize: "0.68rem" }}>
            Quiet-zone margin · {quiet} module{quiet === 1 ? "" : "s"}
          </label>
          <input
            id="qr-quiet"
            type="range"
            min={0}
            max={8}
            step={1}
            value={quiet}
            onChange={(e) => setQuiet(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--red)", marginBottom: 4 }}
          />
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 16 }}>
            {quiet < 4
              ? "Below the 4-module standard — keep it at 4+ if the code will be printed or scanned from a distance."
              : "4 modules is the standard clear margin scanners expect."}
          </p>

          <span className="neu-label" style={{ fontSize: "0.68rem" }}>Center logo (optional)</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
              onChange={(e) => {
                pickLogo(e.target.files?.[0] || null);
                e.target.value = "";
              }}
            />
            <button type="button" className="neu-btn neu-btn-sm" onClick={() => logoInputRef.current?.click()}>
              {logoUrl ? "Change logo" : "Upload logo"}
            </button>
            {logoUrl && (
              <button type="button" className="neu-btn neu-btn-sm" onClick={removeLogo}>
                Remove
              </button>
            )}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 16 }}>
            Auto-sized to ≤ 20% of the code on a white rounded backdrop so it stays scannable.
            {eccBumped && (
              <span style={{ color: "var(--red-dark)", fontWeight: 700 }}>
                {" "}Error correction auto-bumped to Medium (15%) to survive the logo.
              </span>
            )}
          </p>

          <p className="neu-label" style={{ marginBottom: 8 }}>Export</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
            <div>
              <label className="neu-label" htmlFor="qr-ecc" style={{ fontSize: "0.68rem" }}>Error correction</label>
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
              <label className="neu-label" htmlFor="qr-size" style={{ fontSize: "0.68rem" }}>PNG resolution</label>
              <select
                id="qr-size"
                className="neu-select"
                value={pngPx}
                onChange={(e) => setPngPx(Number(e.target.value))}
              >
                {PNG_SIZES.map((s) => (
                  <option key={s} value={s}>{s} px</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ------- Preview ------- */}
        <div>
          <p className="neu-label">Live preview</p>
          <div
            className="result-box"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320, background: "var(--surface)", padding: 16 }}
          >
            {qr.ok ? (
              <canvas
                ref={previewRef}
                style={{ width: "min(100%, 340px)", height: "auto", imageRendering: "auto", display: "block" }}
                role="img"
                aria-label="Generated QR code preview"
              />
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", textAlign: "center", padding: 20 }}>
                {qr.error}
              </p>
            )}
          </div>
          {qr.ok && (
            <p className="font-mono2" style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 10 }}>
              Version {qr.data.version} · {qr.data.size}×{qr.data.size} modules · {ECC_LABEL[effectiveEcc]} correction · {new TextEncoder().encode(payload).length} bytes
            </p>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button type="button" className="neu-btn neu-btn-primary neu-btn-sm" onClick={downloadPng} disabled={!qr.ok}>
              Download PNG ({pngPx}px)
            </button>
            <button type="button" className="neu-btn neu-btn-sm" onClick={downloadSvg} disabled={!qr.ok}>
              Download SVG
            </button>
            <button type="button" className="neu-btn neu-btn-sm" onClick={copyPayload} disabled={!payload}>
              {copied ? "Copied!" : "Copy content"}
            </button>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 12 }}>
            Styled codes and logos scan fine on modern phones, but always test-scan once before
            printing — especially with dots or low contrast.
          </p>
        </div>
      </div>
    </div>
  );
}
