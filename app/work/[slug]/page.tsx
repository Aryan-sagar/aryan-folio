import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "../../../components/CaseStudy";
import { STUDIES } from "../../../components/work-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return STUDIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = STUDIES.find((x) => x.slug === slug);
  return s ? { title: `${s.title} | Aryan Sagar`, description: s.intro } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const i = STUDIES.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const n = STUDIES.length;
  return <CaseStudy s={STUDIES[i]} prev={STUDIES[(i + n - 1) % n]} next={STUDIES[(i + 1) % n]} />;
}