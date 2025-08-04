import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { NavigationMenu } from "@/components/ui";
import type { AvailableRoutesToPath } from "@/config/router";
import { useTranslation } from "@/i18n";
import { getAuthStoreState } from "@/stores";
import { Header } from "./-components";

const PrivateLayout = () => {
  const { t } = useTranslation();

  const links: { path: AvailableRoutesToPath; label: string }[] = [
    { path: "/cities", label: t("navigation.links.cities") },
    { path: "/airlines", label: t("navigation.links.airlines") },
    { path: "/flights", label: t("navigation.links.flights") },
    { path: "/users", label: t("navigation.links.users") },
  ];

  return (
    <div>
      <Header />

      <main className="flex flex-col gap-4 p-4">
        <NavigationMenu.Root>
          <NavigationMenu.List>
            {links.map(({ label, path }) => {
              return (
                <NavigationMenu.Link key={path} to={path}>
                  {label}
                </NavigationMenu.Link>
              );
            })}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <Outlet />
      </main>
    </div>
  );
};

export const Route = createFileRoute("/_private")({
  beforeLoad: ({ location }) => {
    const { token } = getAuthStoreState();

    if (!token) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: PrivateLayout,
});
