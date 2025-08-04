import { createFileRoute } from "@tanstack/react-router";

const RouteComponent = () => {
  const routeMessage = `Hello &quot;/_private/flights/&quot;!`;

  return <div dangerouslySetInnerHTML={{ __html: routeMessage }} />;
};

export const Route = createFileRoute("/_private/flights/")({
  component: RouteComponent,
});
