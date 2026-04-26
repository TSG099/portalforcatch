/**
 * Representative blue whale (Balaenoptera musculus) movement paths for education.
 * Not live satellite or tag data — swap this module for your telemetry API when available.
 */
export type Waypoint = {
  lat: number;
  lng: number;
  recordedAt: string;
};

export type BlueWhaleTrack = {
  id: string;
  individualLabel: string;
  region: string;
  summary: string;
  waypoints: Waypoint[];
};

export const BLUE_WHALE_TRACKS: BlueWhaleTrack[] = [
  {
    id: "nep-01",
    individualLabel: "Northeast Pacific — illustrative track A",
    region: "California Current → Pacific Northwest",
    summary:
      "Shows a seasonal northward movement pattern typical of eastern North Pacific blue whales feeding along productive upwelling zones.",
    waypoints: [
      { lat: 32.7, lng: -117.25, recordedAt: "2025-04-12" },
      { lat: 34.05, lng: -119.35, recordedAt: "2025-05-03" },
      { lat: 36.6, lng: -121.9, recordedAt: "2025-06-18" },
      { lat: 38.9, lng: -123.7, recordedAt: "2025-07-22" },
      { lat: 44.6, lng: -124.1, recordedAt: "2025-08-30" },
    ],
  },
  {
    id: "nep-02",
    individualLabel: "Northeast Pacific — illustrative track B",
    region: "Offshore corridor",
    summary:
      "A second example path highlighting offshore use of habitat; real studies combine tags, acoustic monitoring, and vessel surveys.",
    waypoints: [
      { lat: 40.2, lng: -125.4, recordedAt: "2025-05-20" },
      { lat: 42.1, lng: -127.8, recordedAt: "2025-06-05" },
      { lat: 45.5, lng: -130.2, recordedAt: "2025-07-14" },
      { lat: 48.2, lng: -126.5, recordedAt: "2025-08-02" },
      { lat: 50.1, lng: -128.9, recordedAt: "2025-09-10" },
    ],
  },
];
