import { NextRequest, NextResponse } from "next/server";

type NominatimItem = {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
};

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q")?.trim();

    if (!query || query.length < 3) {
        return NextResponse.json({ results: [] });
    }

    try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", query);
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("limit", "5");
        url.searchParams.set("countrycodes", "it");

        const response = await fetch(url.toString(), {
            cache: "no-store",
            headers: {
                Accept: "application/json",
                "User-Agent": "cheap-fuel-finder/1.0",
            },
        });

        const rawText = await response.text();

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: "Geocoding service error",
                    upstreamStatus: response.status,
                    upstreamBody: rawText,
                },
                { status: response.status }
            );
        }

        const data: NominatimItem[] = JSON.parse(rawText);

        const results = data.map((item) => ({
            id: String(item.place_id),
            label: item.display_name,
            lat: Number(item.lat),
            lng: Number(item.lon),
        }));

        return NextResponse.json({ results });
    } catch {
        return NextResponse.json(
            { error: "Internal geocoding error" },
            { status: 500 }
        );
    }
}