"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "upload" | "camera";

export default function QrScannerClient() {
  const [mode, setMode] = useState<Mode>("upload");
  const [decoded, setDecoded] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  // Always stop the camera when leaving the camera tab or unmounting.
  useEffect(() => {
    return () => stopCamera();
  }, []);
  useEffect(() => {
    if (mode !== "camera") stopCamera();
  }, [mode ]);

  const decodeFromCanvas = async (canvas: HTMLCanvasElement): Promise<string | null> => {
    // jsQR is small but only needed when actually decoding.
    const { default: jsQR } = await import("jsqr");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("no 2d context");
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const result = jsQR(imageData.data, width, height);
    return result ? result.data : null;
  };

  const scanImageFile = async (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("That is not an image file. Upload a JPG, PNG, or WebP containing a QR code.");
      return;
    }
    setError(null);
    setDecoded(null);
    setScanning(true);
    try {
      const url = URL.createObjectURL(f);
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("load"));
        img.src = url;
      });
      const canvas = canvasRef.current!;
      // Cap the decode resolution: QR codes don't need 12 megapixels.
      const maxSide = 1200;
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const text = await decodeFromCanvas(canvas);
      setDecoded(text);
      if (!text) setError("No QR code found in that image. Try a clearer, well-lit photo or a screenshot of the code.");
    } catch {
      setError("Couldn't process that image. Try a different file.");
    } finally {
      setScanning(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setError(null);
    setDecoded(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setCameraActive(true);
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError") {
        setCameraError(
          "Camera permission was denied. Allow camera access in your browser's site settings — or use the Upload tab instead, no camera needed."
        );
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setCameraError("No camera was found on this device. Use the Upload tab and point at a photo or screenshot instead.");
      } else {
        setCameraError("The camera couldn't be started. Use the Upload tab instead — it works without any camera.");
      }
    }
  };

  const scanCameraFrame = async () => {
    const video = videoRef.current;
    if (!video || !cameraActive) return;
    setScanning(true);
    setError(null);
    try {
      const canvas = canvasRef.current!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
      const text = await decodeFromCanvas(canvas);
      setDecoded(text);
      if (!text) setError("No QR code in this frame. Move the code fully into view, keep it steady, and scan again.");
    } catch {
      setError("Couldn't read the camera frame. Try again.");
    } finally {
      setScanning(false);
    }
  };

  const copy = async () => {
    if (!decoded) return;
    try {
      await navigator.clipboard.writeText(decoded);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Copy failed — select the text and copy it manually.");
    }
  };

  return (
    <div className="card" style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {(
          [
            { v: "upload", label: "Upload image" },
            { v: "camera", label: "Live camera" },
          ] as { v: Mode; label: string }[]
        ).map((m) => (
          <button
            key={m.v}
            type="button"
            className="btn btn-sm"
            style={
              mode === m.v
                ? { background: "var(--red)", color: "#fff", borderColor: "var(--red)" }
                : undefined
            }
            onClick={() => setMode(m.v)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "upload" && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) scanImageFile(e.target.files[0]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => inputRef.current?.click()}
            style={{ width: "100%" }}
            disabled={scanning}
          >
            {scanning ? "Scanning…" : "Upload an image with a QR code"}
          </button>
          <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}>
            Screenshots, photos, and downloads all work. The image never leaves your device.
          </p>
        </>
      )}

      {mode === "camera" && (
        <>
          {!cameraActive ? (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={startCamera}
                style={{ width: "100%" }}
              >
                Start camera
              </button>
              <p className="font-mono2" style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "10px 0 0" }}>
                Your browser will ask for camera permission. Video is processed locally — nothing is recorded or sent anywhere.
              </p>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                style={{
                  width: "100%",
                  maxHeight: 380,
                  borderRadius: 12,
                  border: "1px solid var(--line)",
                  background: "#000",
                  display: "block",
                }}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={scanCameraFrame}
                  disabled={scanning}
                >
                  {scanning ? "Scanning…" : "Scan this frame"}
                </button>
                <button type="button" className="btn" onClick={stopCamera}>
                  Stop camera
                </button>
              </div>
            </>
          )}
          {cameraError && (
            <div className="notice" style={{ marginTop: 14 }}>
              {cameraError}
            </div>
          )}
        </>
      )}

      {/* Hidden canvas used for decoding in both modes */}
      <canvas ref={canvasRef} hidden aria-hidden="true" />

      {decoded && (
        <div className="notice notice-ok" style={{ marginTop: 16 }}>
          <strong>QR code decoded:</strong>
          <pre
            className="font-mono2"
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: "10px 0",
              fontSize: "0.85rem",
              lineHeight: 1.6,
            }}
          >
            {decoded}
          </pre>
          <button type="button" className="btn btn-sm" onClick={copy}>
            {copied ? "Copied ✓" : "Copy text"}
          </button>
        </div>
      )}

      {error && (
        <div className="notice" style={{ marginTop: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}
