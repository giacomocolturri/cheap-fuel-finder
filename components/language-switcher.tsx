"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (nextLocale: "it" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => changeLocale("it")}
        className={cn(
          "min-w-12 rounded-xl px-3 py-2 text-sm font-medium transition",
          locale === "it"
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100",
        )}
        aria-pressed={locale === "it"}
      >
        IT
      </button>

      <button
        type="button"
        onClick={() => changeLocale("en")}
        className={cn(
          "min-w-12 rounded-xl px-3 py-2 text-sm font-medium transition",
          locale === "en"
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100",
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
