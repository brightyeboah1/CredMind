import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-small text-inkFaint max-w-2xl mb-6">
          CreditMind uses AI to power features like the AI Educator, Stack
          Optimizer, Debt Optimizer, and card-matching quiz. AI-generated
          content can be inaccurate or out of date — always confirm rates,
          fees, and offers directly with the card issuer before applying.
          CreditMind is not a bank or lender and nothing here is financial
          advice.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-small text-inkFaint">
            © {new Date().getFullYear()} CreditMind. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/resources/terms" className="text-small text-inkMuted hover:text-ink">
              Terms of Service
            </Link>
            <Link href="/resources/privacy" className="text-small text-inkMuted hover:text-ink">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
