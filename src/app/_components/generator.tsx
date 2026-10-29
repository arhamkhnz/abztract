"use client";

import { DialRoot } from "dialkit";
import "dialkit/styles.css";
import { useRef, useState } from "react";
import { downloadArtwork } from "../_lib/export";
import type { ExportFormat } from "../_lib/export";
import { createShareUrl } from "../_lib/url-state";
import { Artwork } from "./artwork";
import { useGenerator } from "./use-generator";

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
    <main
      className="relative min-h-svh"
      style={{ background: settings.background }}
      aria-label="Abztract shape generator"
    >
      <div className="grid min-h-svh place-items-center p-6">
        <Artwork
          settings={settings}
          svgRef={svgRef}
          className="block aspect-square h-auto w-[min(52vmin,560px,100%)] max-[760px]:w-[min(65vw,360px)]"
        />
      </div>
      <footer
        className="fixed bottom-5 left-5 max-w-[calc(100vw-40px)] text-xs leading-relaxed"
        style={{ color: settings.color }}
      >
        <p className="m-0">
          <span className="opacity-60">Made by </span>
          <a
            href="https://github.com/arhamkhnz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 opacity-60 hover:opacity-100"
          >
            arhamkhnz
          </a>
          <span className="opacity-60">. The source code is available on </span>
          <a
            href="https://github.com/arhamkhnz/abztract"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 opacity-60 hover:opacity-100"
          >
            GitHub
          </a>
          <span className="opacity-60">.</span>
        </p>
      </footer>
      <DialRoot mode="popover" position="top-right" theme="dark" defaultOpen productionEnabled versions="menu" />
      <p
        className="fixed bottom-20 left-5 m-0 max-w-[min(360px,calc(100vw-40px))] rounded-md bg-[#202020] text-xs leading-normal text-foreground"
        role={error ? "alert" : "status"}
        aria-live={error ? "assertive" : "polite"}
      >
        {error || message}
      </p>
    </main>
  );
}
