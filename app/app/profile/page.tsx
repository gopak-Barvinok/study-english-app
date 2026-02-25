"use client";

import SignOutBtn from "@/components/buttons/loginButtons/SignOutBtn";
import { useUserStore } from "@/store/userStore";

export default function ProfilePage() {
  const { user } = useUserStore();

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body items-center text-center">
        <h1 className="card-title">
          Welcome, {user?.name} {user?.surname}
        </h1>
        <div className="flex gap-1 items-baseline">
          <h1 className="card-title">Email:</h1>
          <p>{user?.email}</p>
        </div>
        <div className="flex gap-1 items-baseline">
          <h1 className="card-title">ID:</h1>
          <p>{user?.id}</p>
        </div>
        <div className="flex gap-1 items-baseline">
          <h1 className="card-title">Languages:</h1>
          <p>{user?.languages.join(" ")}</p>
        </div>
        <div className="card-actions">
          <SignOutBtn />
        </div>
      </div>
    </div>
  );
}
