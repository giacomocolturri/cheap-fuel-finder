import { FuelEntry, StationApiItem, StationWithBestFuel } from "@/types/station";
import { FuelKind } from "@/types/fuel";

const fuelIdMap: Record<Exclude<FuelKind, "all">, number> = {
    benzina: 1,
    gasolio: 2,
    metano: 3,
    gpl: 4,
};

export function getBestMatchingFuel(
    station: StationApiItem,
    fuelKind: FuelKind
): FuelEntry | null {
    let matches = [...station.fuels];

    if (fuelKind !== "all") {
        matches = matches.filter((fuel) => fuel.fuelId === fuelIdMap[fuelKind]);
    }

    if (matches.length === 0) return null;

    return matches.reduce((best, current) =>
        current.price < best.price ? current : best
    );
}

export function mapStationsWithBestFuel(
    stations: StationApiItem[],
    fuelKind: FuelKind
): StationWithBestFuel[] {
    return stations
        .map((station) => {
            const bestFuel = getBestMatchingFuel(station, fuelKind);
            if (!bestFuel) return null;
            return { station, bestFuel };
        })
        .filter((item): item is StationWithBestFuel => item !== null)
        .sort((a, b) => a.bestFuel.price - b.bestFuel.price);
}