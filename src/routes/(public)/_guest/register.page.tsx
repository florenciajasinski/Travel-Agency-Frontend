import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "@/i18n";

const RegisterPage = () => {
  const { t } = useTranslation();

  return <div>{t("greetings.exactPath", { exactPath: "/register" })}</div>;
};

export const Route = createFileRoute("/(public)/_guest/register/")({ component: RegisterPage });
