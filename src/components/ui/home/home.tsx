import { Link } from "@tanstack/react-router";

export const HomeCard = ({ image, label, to }: { image: string; label: string; to: string }) => {
  return (
    <Link
      className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
      to={to}
    >
      <img alt={label} className="h-14 w-14" src={image} />
      <span className="text-lg font-semibold">{label}</span>
    </Link>
  );
};
