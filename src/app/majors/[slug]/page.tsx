import ClientMajorPage from "./ClientPage";

// Pre-render all known slugs for static export (server component wrapper)
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    { slug: "information-technology" },
    { slug: "data-science" },
    { slug: "computer-science" },
    { slug: "health-informatics" },
    { slug: "public-health" },
    { slug: "management" },
  ];
}

export default function Page({ params }: Readonly<{ params: { slug: string } }>) {
  return <ClientMajorPage params={params} />;
}
