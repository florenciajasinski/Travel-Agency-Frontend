import { createFileRoute } from "@tanstack/react-router";

const RouteComponent = () => {
  const message = `Working on airlines page...`;

  return <div dangerouslySetInnerHTML={{ __html: message }} />;
};

export const Route = createFileRoute("/_private/airlines/")({
  component: RouteComponent,
});
