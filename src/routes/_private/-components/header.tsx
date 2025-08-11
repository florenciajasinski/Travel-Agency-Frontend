const HEADER_TITLE = "Travel Agency";

export const Header = () => {
  return (
    <header className="py-10 text-center">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{HEADER_TITLE}</h1>
    </header>
  );
};
