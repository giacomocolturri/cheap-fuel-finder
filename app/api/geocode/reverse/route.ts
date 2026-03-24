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
    const lat = req.nextUrl.searchParams.get("lat")?.trim();
    const lng = req.nextUrl.searchParams.get("lng")?.trim();

    if (!lat || !lng) {
        return NextResponse.json(
            { error: "Missing lat or lng parameters" },
            { status: 400 },
        );
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Missing GEOAPIFY_API_KEY" },
            { status: 500 },
        );
    }

    try {
        const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
        url.searchParams.set("lat", lat);
        url.searchParams.set("lon", lng);
        url.searchParams.set("lang", "it");
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

        const result = data.results?.[0];
        if (!result) {
            return NextResponse.json(
                { error: "No address found for these coordinates" },
                { status: 404 },
            );
        }

        const address = {
            id: result.place_id ?? "current-location",
            label: result.formatted ?? "",
            lat: result.lat ?? parseFloat(lat),
            lng: result.lon ?? parseFloat(lng),
            city: result.city ?? "",
            postcode: result.postcode ?? "",
            state: result.state ?? "",
            country: result.country ?? "",
        };

        return NextResponse.json({ result: address });
    } catch {
        return NextResponse.json(
            { error: "Internal reverse geocoding error" },
            { status: 500 },
        );
    }
}