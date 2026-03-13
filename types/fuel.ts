export type FuelKind = "all" | "benzina" | "gasolio" | "gpl" | "metano";

export const FUEL_OPTIONS: { label: string; value: FuelKind }[] = [
  { label: "Tutti", value: "all" },
  { label: "Benzina", value: "benzina" },
  { label: "Gasolio", value: "gasolio" },
  { label: "GPL", value: "gpl" },
  { label: "Metano", value: "metano" },
];
