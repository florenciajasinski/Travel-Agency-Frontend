import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { useTranslation } from "@/i18n";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold">{t("dashboard.welcome")}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          className="flex flex-col items-center gap-2 rounded-lg border bg-white p-6 transition hover:shadow-md"
          to="/cities"
        >
          <img alt="Cities" className="h-12 w-12" src="/icons/city-icon.svg" />
          <h3 className="text-lg font-medium">{t("cities.title")}</h3>
        </Link>

        <Link
          className="flex flex-col items-center gap-2 rounded-lg border bg-white p-6 transition hover:shadow-md"
          to="/airlines"
        >
          <img alt="Airlines" className="h-12 w-12" src="/icons/airline-icon.svg" />
          <h3 className="text-lg font-medium">{t("airlines.title")}</h3>
        </Link>

        <Link
          className="flex flex-col items-center gap-2 rounded-lg border bg-white p-6 transition hover:shadow-md"
          to="/flights"
        >
          <img alt="Flights" className="h-12 w-12" src="/icons/flight-icon.svg" />
          <h3 className="text-lg font-medium">{t("flights.title")}</h3>
        </Link>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_private/")({
  component: HomePage,
});
