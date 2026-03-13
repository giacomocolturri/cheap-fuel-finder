"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { StationCard } from "@/components/station-card";
import { StationFilters } from "@/components/station-filters";
import { toMinisterFuelType } from "@/lib/fuel-mapper";
import { mapStationsWithBestFuel } from "@/lib/station-utils";
import { FuelKind } from "@/types/fuel";
import { StationApiItem, StationsSearchResponse } from "@/types/station";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

const StationsMap = dynamic(
  () => import("@/components/station-map").then((mod) => mod.StationsMap),
  { ssr: false },
);

export default function HomePage() {
  const t = useTranslations("HomePage");
  const errorT = useTranslations("Error");
  const cardT = useTranslations("Card");

  const [radius, setRadius] = useState<number>(5);
  const [address, setAddress] = useState("");
  const [fuelKind, setFuelKind] = useState<FuelKind>("all");

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [stations, setStations] = useState<StationApiItem[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const filteredStations = useMemo(() => {
    return mapStationsWithBestFuel(stations, fuelKind);
  }, [stations, fuelKind]);

  const handleSearch = async (customPosition?: {
    lat: number;
    lng: number;
  }) => {
    const targetPosition = customPosition ?? position;

    if (!targetPosition) {
      setError(errorT("selectAddress"));
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const fuelType = toMinisterFuelType(fuelKind);

      const response = await fetch("/api/stations/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: targetPosition.lat,
          lng: targetPosition.lng,
          radius,
          fuelType,
        }),
      });

      const data: StationsSearchResponse | { error: string } =
        await response.json();

      if (!response.ok || !("success" in data)) {
        throw new Error("error" in data ? data.error : errorT("ops"));
      }

      setStations(data.results ?? []);
    } catch {
      setError(errorT("ops"));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto px-4 py-8">
        {/* Header */}
        <div className="relative mb-6 pr-24">
          <div className="absolute right-0 top-0 z-10">
            <LanguageSwitcher />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">{t("subtitle")}</p>
        </div>

        {/* Filters */}
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
          <div className="space-y-6">
            <StationFilters
              radius={radius}
              address={address}
              fuelKind={fuelKind}
              isSearching={isSearching}
              onRadiusChange={setRadius}
              onAddressChange={(value) => {
                setAddress(value);
                setError(null);
              }}
              onAddressSelect={(place) => {
                setAddress(place.label);
                setPosition({ lat: place.lat, lng: place.lng });
                setStations([]);
                setError(null);
              }}
              onFuelChange={setFuelKind}
              onSearch={() => handleSearch()}
            />

            <StationsMap
              center={position}
              radiusKm={radius}
              stations={filteredStations}
            />
          </div>

          {/* Sidebar */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {t("results")}
                </h2>
                <p className="text-sm text-slate-500">{t("resultsSubtitle")}</p>
              </div>

              {!isSearching && hasSearched && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {filteredStations.length} {cardT("found")}
                </span>
              )}
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {!hasSearched && !isSearching && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                {t("empty")}
              </div>
            )}

            <div className="max-h-[78vh] space-y-4 overflow-y-auto pr-1">
              {isSearching && (
                <>
                  <Skeleton className="h-40 w-full rounded-3xl" />
                  <Skeleton className="h-40 w-full rounded-3xl" />
                  <Skeleton className="h-40 w-full rounded-3xl" />
                </>
              )}

              {!isSearching &&
                filteredStations.map((item, index) => (
                  <StationCard
                    key={item.station.id}
                    item={item}
                    highlight={index === 0}
                  />
                ))}

              {!isSearching && hasSearched && filteredStations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  {t("noResults")}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
