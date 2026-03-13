import { FuelKind } from "@/types/fuel";

export function toMinisterFuelType(fuelKind: FuelKind): string | undefined {
  if (fuelKind === "all") return undefined;

  const baseMap: Record<Exclude<FuelKind, "all">, string> = {
    benzina: "1",
    gasolio: "2",
    metano: "3",
    gpl: "4",
  };

  return `${baseMap[fuelKind]}-x`;
}
