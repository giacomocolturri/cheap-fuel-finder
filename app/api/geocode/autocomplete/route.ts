import { NextRequest, NextResponse } from "next/server";

type GeoapifyResult = {
    place_id?: string;
    formatted?: string;
    lat?: number;
    lon?: number;
    city?: string;
    postcode?: string;
    state?: string;
    country?: string;
};

type GeoapifyResponse = {
    results?: GeoapifyResult[];
};

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q")?.trim();

    if (!query || query.length < 3) {
        return NextResponse.json({ results: [] });
    }

    const apiKey = "227e3012849f43a099d75a235a733e88";

    if (!apiKey) {
        return NextResponse.json(
            { error: "Missing GEOAPIFY_API_KEY" },
            { status: 500 },
        );
    }

    try {
        const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
        url.searchParams.set("text", query);
        url.searchParams.set("limit", "5");
        url.searchParams.set("lang", "it");
        url.searchParams.set("filter", "countrycode:it");
        url.searchParams.set("format", "json");
        url.searchParams.set("apiKey", apiKey);

        const response = await fetch(url.toString(), {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        const rawText = await response.text();

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: "Geoapify service error",
                    upstreamStatus: response.status,
                    upstreamBody: rawText,
                },
                { status: response.status },
            );
        }

        const data: GeoapifyResponse = JSON.parse(rawText);

        const results =
            data.results?.map((item, index) => ({
                id: item.place_id ?? String(index),
                label: item.formatted ?? "",
                lat: item.lat ?? 0,
                lng: item.lon ?? 0,
                city: item.city ?? "",
                postcode: item.postcode ?? "",
                state: item.state ?? "",
                country: item.country ?? "",
            })) ?? [];

        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal geocoding error" },
            { status: 500 },
        );
    }
}