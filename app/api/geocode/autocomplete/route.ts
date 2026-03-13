import { NextRequest, NextResponse } from "next/server";

type PhotonFeature = {
    geometry?: {
        coordinates?: [number, number];
    };
    properties?: {
        name?: string;
        street?: string;
        housenumber?: string;
        postcode?: string;
        city?: string;
        state?: string;
        country?: string;
    };
};

type PhotonResponse = {
    features?: PhotonFeature[];
};

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q")?.trim();

    if (!query || query.length < 3) {
        return NextResponse.json({ results: [] });
    }

    try {
        const url = new URL("https://photon.komoot.io/api/");
        url.searchParams.set("q", query);
        url.searchParams.set("limit", "5");
        url.searchParams.set("lang", "en");

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
                    error: "Errore nel servizio di geocoding",
                    upstreamStatus: response.status,
                    upstreamBody: rawText,
                },
                { status: response.status }
            );
        }

        const data: PhotonResponse = JSON.parse(rawText);

        const results = (data.features ?? [])
            .map((feature, index) => {
                const coords = feature.geometry?.coordinates;
                const p = feature.properties;

                if (!coords || coords.length < 2) return null;

                const lng = coords[0];
                const lat = coords[1];

                const parts = [
                    p?.name,
                    [p?.street, p?.housenumber].filter(Boolean).join(" "),
                    p?.postcode,
                    p?.city,
                    p?.state,
                    p?.country,
                ].filter(Boolean);

                return {
                    id: `${lat}-${lng}-${index}`,
                    label: parts.join(", "),
                    lat,
                    lng,
                };
            })
            .filter(Boolean);

        return NextResponse.json({ results });
    } catch (error) {

        return NextResponse.json(
            { error: "Errore interno durante il geocoding" },
            { status: 500 }
        );
    }
}