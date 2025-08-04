import { createFileRoute } from "@tanstack/react-router";

const RouteComponent = () => {
  const message = `Hello &quot;/_private/airlines/&quot;!`;

  return <div dangerouslySetInnerHTML={{ __html: message }} />;
};

export const Route = createFileRoute("/_private/airlines/")({
  component: RouteComponent,
});
