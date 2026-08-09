"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { IconClose, IconCheck } from "./icons";

const RESOURCE_LINKS = [
  { slug: "help", label: "Help centre" },
  { slug: "learn", label: "Learn" },
  { slug: "terms", label: "Terms of service" },
  { slug: "privacy", label: "Privacy policy" },
  { slug: "licenses", label: "Licenses" },
];

export default function AccountPanel({
  email,
  onClose,
}: {
  email?: string;
  onClose: () => void;
}) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("referral_code, push_notifications")
        .eq("id", user.id)
        .single();
      if (data) {
        setReferralCode(data.referral_code ?? null);
        setPushNotifications(data.push_notifications ?? true);
      }
    })();
  }, []);

  const copyReferralLink = () => {
    if (!referralCode) return;
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePush = async () => {
    const next = !pushNotifications;
    setPushNotifications(next);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    try {
      await supabase.from("profiles").update({ push_notifications: next }).eq("id", user.id);
    } catch {
      // column may not exist yet on this project — UI already reflects the toggle
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-canvas border-l border-border z-50 overflow-y-auto">
        <div className="flex items-center justify-between px-6 h-16 border-b border-border sticky top-0 bg-canvas">
          <span className="text-body font-semibold text-ink">Account</span>
          <button onClick={onClose} className="text-inkMuted hover:text-ink">
            <IconClose width={20} height={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-full bg-accentMuted flex items-center justify-center text-accent font-semibold">
              {email?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="text-body text-ink truncate">{email}</div>
          </div>

          {referralCode && (
            <div className="card-panel p-5 mb-8">
              <p className="label-micro text-accent mb-2">Refer a friend</p>
              <p className="text-small text-inkMuted mb-4">
                Get cash back when a friend signs up and gets approved for a card.
              </p>
              <button onClick={copyReferralLink} className="btn-secondary w-full text-small !py-2.5">
                {copied ? (
                  <span className="flex items-center justify-center gap-2">
                    <IconCheck width={16} height={16} /> Link copied
                  </span>
                ) : (
                  "Copy my referral link"
                )}
              </button>
            </div>
          )}

          <p className="label-micro text-inkFaint mb-3">Settings</p>
          <div className="mb-8">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-body text-ink">Push notifications</span>
              <button
                onClick={togglePush}
                className={`w-11 h-6 rounded-full transition-colors duration-250 relative ${
                  pushNotifications ? "bg-accent" : "bg-surfaceRaised"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-250 ${
                    pushNotifications ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <p className="label-micro text-inkFaint mb-3">Resources</p>
          <div className="mb-8">
            {RESOURCE_LINKS.map((r) => (
              <Link
                key={r.slug}
                href={`/resources/${r.slug}`}
                onClick={onClose}
                className="block py-3 text-body text-inkMuted hover:text-ink border-b border-border last:border-0"
              >
                {r.label}
              </Link>
            ))}
          </div>

          <button onClick={handleSignOut} className="text-body text-negative font-medium">
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
