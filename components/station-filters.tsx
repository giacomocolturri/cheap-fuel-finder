"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FuelKind, FUEL_OPTIONS } from "@/types/fuel";
import { useTranslations } from "next-intl";

type Props = {
  radius: number;
  address: string;
  fuelKind: FuelKind;
  isSearching: boolean;
  onRadiusChange: (value: number) => void;
  onAddressChange: (value: string) => void;
  onAddressSelect: (place: { label: string; lat: number; lng: number }) => void;
  onFuelChange: (value: FuelKind) => void;
  onSearch: () => void;
};

export function StationFilters({
  radius,
  address,
  fuelKind,
  isSearching,
  onRadiusChange,
  onAddressChange,
  onAddressSelect,
  onFuelChange,
  onSearch,
}: Props) {
  const t = useTranslations("Filters");
  const fuelT = useTranslations("Fuel");

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{t("title")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {t("address")}
        </label>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <AddressAutocomplete
              value={address}
              onValueChange={onAddressChange}
              onPlaceSelect={onAddressSelect}
            />
          </div>

          <div className="shrink-0">
            <Button
              disabled={true}
              variant="outline"
              className="h-11 rounded-xl w-20"
            >
              {t("gps")}
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_80px_auto] gap-6 md:items-center">
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("fuel")}
            </label>
            <Select
              value={fuelKind}
              onValueChange={(value) => onFuelChange(value as FuelKind)}
            >
              <SelectTrigger className="h-11 rounded-xl w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FUEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {fuelT(option.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                {t("radius")}
              </label>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {radius} km
              </span>
            </div>

            <div>
              <Slider
                value={[radius]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => onRadiusChange(value[0])}
              />
            </div>
          </div>

          {/* spacer column on md+ to create space between slider and button */}
          <div className="hidden md:block" aria-hidden />

          <div className="flex justify-center md:justify-end md:items-end">
            <div className="w-full md:w-32">
              <Button
                onClick={onSearch}
                disabled={isSearching}
                className="h-11 rounded-xl w-full"
              >
                {isSearching ? t("searching") : t("search")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
