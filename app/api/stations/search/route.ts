import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://carburanti.mise.gov.it/ospzApi";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { lat, lng, radius, fuelType } = body;

        if (
            typeof lat !== "number" ||
            typeof lng !== "number" ||
            typeof radius !== "number"
        ) {
            return NextResponse.json(
                { error: "Parametri non validi" },
                { status: 400 }
            );
        }

        const payload: Record<string, unknown> = {
            points: [{ lat, lng }],
            radius,
            priceOrder: "asc",
        };

        if (fuelType) {
            payload.fuelType = fuelType;
        }

        const response = await fetch(`${BASE_URL}/search/zone`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Errore nella chiamata al servizio carburanti" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Errore interno durante la ricerca" },
            { status: 500 }
        );
    }
}