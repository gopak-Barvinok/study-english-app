"use client";

import { useUserStore } from "@/store/userStore";
import { gmtOffsetToString, calculateAge } from "@/scripts/client";
import { useMemo } from "react";
import type { LanguageItem } from "@/types/c-types";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUserStore();
  const router = useRouter();
  const age = useMemo(() => calculateAge(user?.age!), [user?.age]);

  return (
    <div>
      <div className="card bg-base-100 w-96 shadow-sm items-center text-center">
        <figure className="justify-center pt-5">
          <img src={user?.image!} alt="Avatar" className="rounded-xl" />
        </figure>
        <div className="card-body">
          <div className="items-start text-start">
            <h1 className="card-title flex">
              Welcome, {user?.name} {user?.surname}
            </h1>
            <div className="flex gap-1 items-baseline">
              <h1 className="card-title">Email:</h1>
              <p>{user?.email}</p>
            </div>
            <div className="flex gap-1 items-baseline">
              <h1 className="card-title">Age:</h1>
              {age && <p>{age}</p>}
            </div>
            <div className="flex gap-1 items-baseline">
              <h1 className="card-title">Location:</h1>
              <p>{user?.location}</p>
            </div>
            <div className="flex gap-1 items-baseline">
              <h1 className="card-title">Timezone:</h1>
              <p>{gmtOffsetToString(Number(user?.timezone))}</p>
            </div>
            <div className="flex gap-1 items-baseline">
              <h1 className="card-title">Languages:</h1>
              {user?.languages &&
                (user?.languages as LanguageItem[]).map((item, i) => (
                  <p key={i}>
                    {item?.languageName}: {item?.level}
                  </p>
                ))}
            </div>
          </div>
          <div className="card-actions justify-center">
            <button
              className="btn btn-success"
              onClick={() => router.push("/app/profile/settings")}
            >
              Go to settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
