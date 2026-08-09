import Link from "next/link";
import { ACCOUNTS } from "@/data/accounts";
import { notFound } from "next/navigation";

export default function AccountTypePage({ params }: { params: { type: string } }) {
  const account = ACCOUNTS.find((a) => a.id === params.type);
  if (!account) notFound();

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="text-h1 text-ink mb-3">{account.title}</h1>
      <p className="text-body text-inkMuted mb-8">
        {account.blurb} We're still building this comparison — check back soon.
      </p>
      <Link href="/" className="btn-primary inline-block">
        Back to Explore
      </Link>
    </div>
  );
}
