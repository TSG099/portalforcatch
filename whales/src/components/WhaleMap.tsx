"use client";

import {
  CircleMarker,
  LayerGroup,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import type { BlueWhaleTrack } from "@/data/blueWhaleTracks";
import "leaflet/dist/leaflet.css";

const TRACK_COLORS = ["#38bdf8", "#34d399", "#a78bfa", "#f472b6"] as const;

type WhaleMapProps = {
  tracks: BlueWhaleTrack[];
  selectedId?: string | null;
};

export function WhaleMap({ tracks, selectedId }: WhaleMapProps) {
  const center: [number, number] = [40, -125];
  const zoom = 4;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-[min(28rem,70vh)] w-full rounded-xl border border-sky-800/50 shadow-lg shadow-slate-950/40 [&_.leaflet-control-attribution]:text-[10px]"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {tracks.map((track, index) => {
        const positions = track.waypoints.map(
          (w) => [w.lat, w.lng] as [number, number],
        );
        const color = TRACK_COLORS[index % TRACK_COLORS.length];
        const dimmed = selectedId && selectedId !== track.id;
        return (
          <LayerGroup key={track.id}>
            <Polyline
              positions={positions}
              pathOptions={{
                color,
                weight: dimmed ? 2 : 4,
                opacity: dimmed ? 0.35 : 0.95,
              }}
            />
            {track.waypoints.map((w, i) => (
              <CircleMarker
                key={`${track.id}-${i}`}
                center={[w.lat, w.lng]}
                radius={dimmed ? 4 : 7}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: dimmed ? 0.4 : 0.85,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="min-w-[12rem] text-slate-900">
                    <p className="font-semibold">{track.individualLabel}</p>
                    <p className="text-xs text-slate-600">{w.recordedAt}</p>
                    <p className="mt-1 text-xs leading-snug">{track.summary}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </LayerGroup>
        );
      })}
    </MapContainer>
  );
}
