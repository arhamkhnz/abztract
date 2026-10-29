"use client";

import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { useRef, useState } from "react";
import { downloadArtwork } from "../_lib/export";
import type { ExportFormat } from "../_lib/export";
import { createShareUrl } from "../_lib/url-state";
import { Artwork } from "./artwork";
import { useGenerator } from "./use-generator";
import styles from "./generator.module.css";

export function Generator() {
  const { values, settings, ready } = useGenerator((action) => {
    if (action === "copyLink") void copyLink();
    if (action === "downloadSVG") void handleDownload("svg");
    if (action === "downloadPNG") void handleDownload("png");
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const exportingRef = useRef(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function copyLink() {
    setError("");
    setMessage("");
    try {
      await navigator.clipboard.writeText(createShareUrl(window.location.href, values).href);
      setMessage("Link copied.");
    } catch {
      setError("Could not copy the link. You can copy it from the address bar.");
    }
  }

  async function handleDownload(format: ExportFormat) {
    if (!svgRef.current || exportingRef.current) return;
    exportingRef.current = true;
    setError("");
    setMessage("Preparing download…");
    try {
      await downloadArtwork(format, {
        svg: svgRef.current,
        seed: values.seed,
        settings,
        transparent: values.export.transparent,
        size: Number(values.export.pngSize),
      });
      setMessage(`${format.toUpperCase()} download ready.`);
    } catch (cause) {
      setMessage("");
      setError(cause instanceof Error ? cause.message : "The download failed. Please try again.");
    } finally {
      exportingRef.current = false;
    }
  }

  if (!ready) return null;

  return (
    <main className={styles.app} style={{ background: settings.background }} aria-label="Abztract shape generator">
      <div className={styles.canvas}>
        <Artwork settings={settings} svgRef={svgRef} className={styles.artwork} />
      </div>
      <span className={styles.seed} style={{ color: settings.color }}>{values.seed}</span>
      <DialRoot position="top-right" theme="dark" defaultOpen productionEnabled versions="menu" />
      {error ? <p className={styles.notice} role="alert">{error}</p>
        : <p className={styles.notice} role="status" aria-live="polite">{message}</p>}
    </main>
  );
}
