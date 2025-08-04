import { useTranslation } from "@/i18n";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="py-10 text-center">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Travel Agency</h1>
    </header>
  );
};
