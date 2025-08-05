import { createFileRoute } from "@tanstack/react-router";

import { HomeCard } from "@/components/ui/home/index";
import { useTranslation } from "@/i18n";
import airlineImage from "@/images/airline.png";
import cityImage from "@/images/city.png";
import flightImage from "@/images/flight.png";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-12 bg-gray-50 px-4 py-12">
      <h1 className="text-center text-4xl font-bold">{t("dashboard.welcome")}</h1>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <HomeCard image={cityImage} label={t("cities.title")} to="/cities" />
        <HomeCard image={airlineImage} label={t("airlines.title")} to="/airlines" />
        <HomeCard image={flightImage} label={t("flights.title")} to="/flights" />
      </div>
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: HomePage,
});
