export type FuelEntry = {
    id: number;
    price: number;
    name: string;
    fuelId: number;
    isSelf: boolean;
};

export type StationApiItem = {
    id: number;
    name: string;
    fuels: FuelEntry[];
    location: {
        lat: number;
        lng: number;
    };
    insertDate: string;
    address: string | null;
    brand: string | null;
    distance: string;
};

export type StationsSearchResponse = {
    success: boolean;
    center: {
        lat: number;
        lng: number;
    };
    results: StationApiItem[];
};

export type StationWithBestFuel = {
    station: StationApiItem;
    bestFuel: FuelEntry;
};