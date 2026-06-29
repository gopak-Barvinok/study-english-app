"use client";

import { useUserStore } from "@/store/userStore";
import { gmtOffsetToString, calculateAge } from "@/scripts/client";
import { useMemo } from "react";
import type { LanguageItem } from "@/types/c-types";
import { useRouter } from "next/navigation";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-base-300/50 last:border-0">
      <span className="text-sm text-base-content/50 font-medium">{label}</span>
      <span className="text-sm text-base-content">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useUserStore();
  const router = useRouter();
  const age = useMemo(() => calculateAge(user?.age!), [user?.age]);

  if (!user) return null;

  const languages = (user.languages as LanguageItem[] | undefined)
    ?.map((l) => `${l.languageName}: ${l.level}`)
    .join(", ");

  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xl w-full max-w-sm animate-fade-in overflow-hidden mx-auto my-auto">
      {/* Avatar header */}
      <div className="bg-base-300/50 flex flex-col items-center py-8 px-6 gap-3">
        <img
          src={user.image!}
          alt="Avatar"
          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/30"
        />
        <div className="text-center">
          <h1 className="font-bold text-lg">
            {user.name} {user.surname}
          </h1>
          {user.username && (
            <p className="text-base-content/50 text-sm">@{user.username}</p>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="px-6 py-4 space-y-0">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Age" value={age != null ? String(age) : undefined} />
        <InfoRow label="Location" value={user.location} />
        <InfoRow
          label="Timezone"
          value={user.timezone ?? undefined}
        />
        <InfoRow label="Languages" value={languages} />
      </div>

      {/* Action */}
      <div className="px-6 pb-6">
        <button
          className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
          onClick={() => router.push("/app/profile/settings")}
        >
          Settings
        </button>
      </div>
    </div>
  );
}
