"use client";

import { useEffect, useRef, useState } from "react";

interface RiderLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "available" | "on_delivery" | "offline";
}

interface DispatchRiderMapProps {
  riders?: RiderLocation[];
  companyName?: string;
  height?: number;
}

export default function DispatchRiderMap({
  riders,
  companyName = "Dispatch Network",
  height = 400,
}: DispatchRiderMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeRider, setActiveRider] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapInstanceRef.current) return;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [6.5244, 3.3792], // Lagos center
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false,
      });

      // Dark theme tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Custom icons
      const availableIcon = L.divIcon({
        className: "",
        html: `<div style="width:24px;height:24px;background:linear-gradient(135deg,#00bda6,#0a54a6);border:2px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:bold;">📦</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const deliveryIcon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#dc2626,#f97316);border:2px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;">🚚</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      riders?.forEach((rider) => {
        const icon = rider.status === "on_delivery" ? deliveryIcon : availableIcon;
        const marker = L.marker([rider.lat, rider.lng], { icon }).addTo(map);

        marker.bindTooltip(
          `<div style="font-family:system-ui;padding:4px 0;">
            <div style="font-weight:600;font-size:12px;color:#e8e8e8;">${rider.name}</div>
            <div style="font-size:10px;color:#666;margin-top:2px;">
              ${rider.status === "on_delivery" ? "🔴 On Delivery" : rider.status === "available" ? "🟢 Available" : "⚫ Offline"}
            </div>
          </div>`,
          { direction: "top", offset: L.point(0, -14) }
        );

        marker.on("click", () => {
          setActiveRider(rider.id);
          map.setView([rider.lat, rider.lng], 15, { animate: true });
        });

        markersRef.current.push(marker);
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);

      // Fit bounds to show all markers
      if (riders && riders.length > 0) {
        const bounds = L.latLngBounds(riders.map((r) => [r.lat, r.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [riders]);

  const statusColor = { available: "text-emerald-400", on_delivery: "text-red-400", offline: "text-gray-400" };
  const statusLabel = { available: "Available", on_delivery: "On Delivery", offline: "Offline" };

  return (
    <div className="bg-surface rounded-xl border border-default overflow-hidden">
      {/* Map Header */}
      <div className="px-5 py-4 border-b border-default flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Live Rider Map</h3>
          <p className="text-xs text-text-muted mt-0.5">{companyName} — {riders?.length ?? 0} riders</p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            On Delivery
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} style={{ width: "100%", height }} className="relative">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-app">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-brand-teal-light border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-text-muted">Loading map...</span>
            </div>
          </div>
        )}
      </div>

      {/* Rider List */}
      <div className="border-t border-default divide-y divide-default">
        {riders && riders.length > 0 ? (
          riders.map((rider) => (
            <button
              key={rider.id}
              onClick={() => {
                setActiveRider(rider.id);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([rider.lat, rider.lng], 15, { animate: true });
                }
              }}
              className={`w-full flex items-center justify-between px-5 py-3 text-left transition-all hover:bg-surface-hover ${
                activeRider === rider.id ? "bg-brand-teal-light/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  rider.status === "available" ? "bg-emerald-400" :
                  rider.status === "on_delivery" ? "bg-red-400" : "bg-gray-400"
                }`} />
                <div>
                  <div className="text-sm font-medium text-text-primary">{rider.name}</div>
                  <div className={`text-xs ${statusColor[rider.status]} capitalize`}>
                    {statusLabel[rider.status]}
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-text-muted">
                {rider.lat.toFixed(4)}, {rider.lng.toFixed(4)}
              </div>
            </button>
          ))
        ) : (
          <div className="px-5 py-8 text-center text-sm text-text-muted">
            No active riders to display
          </div>
        )}
      </div>
    </div>
  );
}
