import { createFileRoute } from "@tanstack/react-router";

const RouteComponent = () => {
  const routeMessage = `Working on flights page...`;

  return <div dangerouslySetInnerHTML={{ __html: routeMessage }} />;
};

export const Route = createFileRoute("/_private/flights/")({
  component: RouteComponent,
});
