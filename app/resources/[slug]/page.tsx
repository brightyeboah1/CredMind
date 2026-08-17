import Link from "next/link";
import { notFound } from "next/navigation";
import LegalDocument from "@/components/LegalDocument";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "@/data/legal";

const RESOURCES: Record<string, { title: string; blurb: string }> = {
  help: {
    title: "Help centre",
    blurb: "Answers to common questions about using CreditMind.",
  },
  learn: {
    title: "Learn",
    blurb: "Guides on credit scores, rewards, and debt payoff strategies.",
  },
  licenses: {
    title: "Licenses",
    blurb: "Open-source software and attributions used in this app.",
  },
};

export default function ResourcePage({ params }: { params: { slug: string } }) {
  if (params.slug === "terms") return <LegalDocument doc={TERMS_OF_SERVICE} />;
  if (params.slug === "privacy") return <LegalDocument doc={PRIVACY_POLICY} />;

  const resource = RESOURCES[params.slug];
  if (!resource) notFound();

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="text-h1 text-ink mb-3">{resource.title}</h1>
      <p className="text-body text-inkMuted mb-8">
        {resource.blurb} This page is coming soon.
      </p>
      <Link href="/home" className="btn-primary inline-block">
        Back to Home
      </Link>
    </div>
  );
}
