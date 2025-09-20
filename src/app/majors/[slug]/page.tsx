import ClientMajorPage from "./ClientPage";

// احذف السطر السابق أو جعله false (لأن عندك static export)
// export const dynamicParams = true;
export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = [
    "information-technology",
    "computer-science",
    "data-science",
    "health-informatics",
    "public-health",
    "management",
  ];
  return slugs.map((slug) => ({ slug }));
}

export default function MajorPage({ params }: { params: { slug: string } }) {
  return <ClientMajorPage params={params} />;
}
