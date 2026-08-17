import { LegalDoc } from "@/data/legal";

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-h1 text-ink mb-2">{doc.title}</h1>
      <p className="text-small text-inkFaint mb-10">Effective {doc.effectiveDate}</p>
      <p className="text-body text-inkMuted mb-10">{doc.intro}</p>
      <div className="space-y-10">
        {doc.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-h3 text-ink mb-3">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="text-body text-inkMuted mb-3 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
