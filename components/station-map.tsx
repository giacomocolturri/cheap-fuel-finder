"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import { StationWithBestFuel } from "@/types/station";

// Fix default icon Leaflet in Next.js
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  center: { lat: number; lng: number } | null;
  radiusKm: number;
  stations: StationWithBestFuel[];
};

function RecenterMap({
  center,
}: {
  center: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 12);
    }
  }, [center, map]);

  return null;
}

export function StationsMap({ center, radiusKm, stations }: Props) {
  const defaultCenter: [number, number] = center
    ? [center.lat, center.lng]
    : [45.4642, 9.19];

  return (
    <div className="max-w-full h-72 w-full overflow-hidden rounded-3xl border bg-white shadow-sm md:h-105">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full max-w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        {center && (
          <>
            <Marker position={[center.lat, center.lng]}>
              <Popup>La tua posizione / indirizzo selezionato</Popup>
            </Marker>

            <Circle
              center={[center.lat, center.lng]}
              radius={radiusKm * 1000}
            />
          </>
        )}

        {stations.map(({ station, bestFuel }) => (
          <Marker
            key={station.id}
            position={[station.location.lat, station.location.lng]}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{station.name}</div>
                <div className="text-sm">
                  {station.brand ?? "Brand non disponibile"}
                </div>
                <div className="text-sm">
                  {bestFuel.name} {bestFuel.isSelf ? "Self" : "Servito"} — €{" "}
                  {bestFuel.price.toFixed(3)}
                </div>
                <div className="text-xs text-slate-500">
                  {Number(station.distance).toFixed(2)} km
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
