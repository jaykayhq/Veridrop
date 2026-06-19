/* eslint-disable */
"use client";

import { useState, useEffect } from "react";

export default function VendorStore() {
  const [slug, setSlug] = useState("gadgethub-ng");
  const [storeName, setStoreName] = useState("GadgetHub NG");
  const [tagline, setTagline] = useState("Premium Electronics, Trusted Delivery");
  const [description, setDescription] = useState("Shop the latest smartphones, laptops, and accessories. Every order is inspection-protected by Veridrop.");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const storeUrl = `${origin}/s/${slug}`;

  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Storefront</h1>
        <p className="text-sm text-text-muted mt-1">Your unique Veridrop-powered store link</p>
      </div>

      {/* Store Link Card */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">Your Store Link</p>
            <p className="text-sm text-text-muted mt-1">Share this link with customers or embed it on your website</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-default bg-app px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-input border border-default rounded-lg p-3">
          <div className="flex-1 font-mono text-sm text-brand-teal-light truncate">
            {storeUrl}
          </div>
          <button
            onClick={copyLink}
            className="shrink-0 px-4 py-1.5 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Store Settings */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Store Settings</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">Store Name</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-mono">/s/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                className="flex-1 px-3 py-2 text-sm bg-input border border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent"
              />
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs text-text-muted uppercase tracking-wider">Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs text-text-muted uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-input border border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>
      </div>

      {/* Embed Code */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Embed Widget</h3>
        <p className="text-xs text-text-muted mb-3">
          Add this widget to your existing website to enable Veridrop checkout
        </p>
        <div className="bg-input border border-default rounded-lg p-3 font-mono text-xs text-text-secondary overflow-x-auto">
          {`<div data-veridrop-store="${slug}" data-theme="dark"></div>\n<script src="https://veridrop.app/widget.js"></script>`}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`<div data-veridrop-store="${slug}" data-theme="dark"></div>\n<script src="https://veridrop.app/widget.js"></script>`);
          }}
          className="mt-3 px-4 py-1.5 border border-default text-text-secondary text-xs font-medium rounded-md hover:border-hover transition-colors"
        >
          Copy Code
        </button>
      </div>
    </div>
  );
}

