"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

type Suggestion = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  onPlaceSelect: (place: { label: string; lat: number; lng: number }) => void;
};

export function AddressAutocomplete({
  value,
  onValueChange,
  onPlaceSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const t = useTranslations("Filters");
  const errorT = useTranslations("Error");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = value.trim();

    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/geocode/autocomplete?q=${encodeURIComponent(q)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Geocode API error:", data.error);
          throw new Error(errorT("ops"));
        }

        const nextSuggestions = data.results ?? [];
        setSuggestions(nextSuggestions);
        setOpen(hasInteracted && nextSuggestions.length > 0);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [value, hasInteracted]);

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={value}
        onChange={(e) => {
          setHasInteracted(true);
          onValueChange(e.target.value);
        }}
        onFocus={() => {
          setHasInteracted(true);
          if (suggestions.length > 0) {
            setOpen(true);
          }
        }}
        placeholder={t("addressInput")}
        className="h-11 rounded-xl"
      />

      {loading && (
        <div className="mt-2 text-xs text-slate-500">{t("addressLoading")}</div>
      )}

      {open && (
        <div className="absolute left-0 right-0 top-full z-1000 mt-2 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onValueChange(item.label);
                  onPlaceSelect(item);
                  setOpen(false);
                  setHasInteracted(false);
                }}
                className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-slate-100"
              >
                <div className="text-sm font-medium text-slate-900">
                  {item.label}
                </div>
              </button>
            ))
          ) : !loading ? (
            <div className="px-3 py-2 text-sm text-slate-500">
              {errorT("addressError")}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
