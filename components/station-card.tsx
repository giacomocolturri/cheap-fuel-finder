import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StationWithBestFuel, FuelEntry } from "@/types/station";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

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
      <CardContent className="p-3 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {highlight && (
              <Badge className="rounded-full mb-2 md:mb-3">
                {t("cheapest")}
              </Badge>
            )}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-slate-900 truncate">
                {station.name}
              </h3>
            </div>

            <div className="mt-2 flex flex-wrap gap-1 md:gap-2 items-center text-xs md:text-sm">
              {station.brand && (
                <Badge
                  variant="secondary"
                  className="rounded-full text-xs md:text-sm"
                >
                  {station.brand}
                </Badge>
              )}

              <Badge
                variant="outline"
                className="rounded-full whitespace-nowrap text-xs flex items-center gap-1"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${station.location.lat},${station.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600  font-medium text-xs inline-flex gap-1"
                >
                  <MapPin className="h-4 w-4" />
                  {Number(station.distance).toFixed(2)} km
                </a>
              </Badge>

              {bestFuel && (
                <Badge
                  variant="outline"
                  className="rounded-full whitespace-nowrap text-xs"
                >
                  {t("bestPrice")}: {bestFuel.name} €{" "}
                  {bestFuel.price.toFixed(3)}
                </Badge>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {t("updated")}:{" "}
              {new Date(station.insertDate).toLocaleString("it-IT")}
            </p>
          </div>

          <div className="shrink-0 whitespace-nowrap text-right">
            <p className="text-xs md:text-sm text-slate-500">{t("from")}</p>
            <p className="text-xl md:text-3xl font-bold text-slate-950">
              € {bestFuel ? bestFuel.price.toFixed(3) : "-"}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2 md:space-y-3">
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
