import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StationWithBestFuel, FuelEntry } from "@/types/station";
import { useTranslations } from "next-intl";

type Props = {
  item: StationWithBestFuel;
  highlight?: boolean;
};

function FuelBadge({ fuel }: { fuel: FuelEntry }) {
  return (
    <Badge
      variant="secondary"
      className="rounded-full px-3 py-1 text-xs font-medium"
    >
      {fuel.name} € {fuel.price.toFixed(3)}
    </Badge>
  );
}

export function StationCard({ item, highlight = false }: Props) {
  const { station, bestFuel } = item;

  const selfFuels = station.fuels.filter((fuel) => fuel.isSelf);
  const servedFuels = station.fuels.filter((fuel) => !fuel.isSelf);

  const t = useTranslations("Card");

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {highlight && (
              <Badge className="rounded-full mb-3">{t("cheapest")}</Badge>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {station.name}
              </h3>

              {station.brand && (
                <Badge variant="secondary" className="rounded-full">
                  {station.brand}
                </Badge>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <Badge
                variant="outline"
                className="rounded-full whitespace-nowrap"
              >
                {Number(station.distance).toFixed(2)} km
              </Badge>

              {bestFuel && (
                <Badge
                  variant="outline"
                  className="rounded-full whitespace-nowrap"
                >
                  {t("bestPrice")}: {bestFuel.name} €{" "}
                  {bestFuel.price.toFixed(3)}
                </Badge>
              )}
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${station.location.lat},${station.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              {t("openMaps")}
            </a>

            <p className="mt-2 text-xs text-slate-400">
              {t("updated")}:{" "}
              {new Date(station.insertDate).toLocaleString("it-IT")}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm text-slate-500">{t("from")}</p>
            <p className="text-3xl font-bold text-slate-950">
              € {bestFuel ? bestFuel.price.toFixed(3) : "-"}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {selfFuels.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {t("self")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selfFuels.map((fuel) => (
                    <FuelBadge key={fuel.id} fuel={fuel} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {servedFuels.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {t("served")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {servedFuels.map((fuel) => (
                    <FuelBadge key={fuel.id} fuel={fuel} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
