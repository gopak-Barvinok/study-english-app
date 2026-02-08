"use client";

import Loading from "@/components/procedures/Loading";
import { generateCallId } from "@/scripts/client";
import { useUserStore } from "@/store/userStore";
import { User } from "@/types/user";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { dateNow } from "@/utils/server";
import AsyncButton from "@/components/buttons/AsyncBtn";

export default function CallsPage() {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      fetch("/api/user", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((data) => data.json())
        .then((resp) => {
          const users: User[] = resp.users.filter(
            (u: User) => u.userId !== user.userId,
          );
          setUsersList(users);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [user]);

  const handleRedirectToClassRoom = async (userId: string) => {
    const callId = generateCallId();
    const body = {
      roomId: callId,
      partisipantsId: [user!.userId, userId],
      createdAt: dateNow(),
    };

    //Создаём комнату
    fetch("/api/room", {
      method: "POST",
      body: JSON.stringify(body),
    }).then(_ => redirect(`/calling/${callId}`));
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      {usersList.length > 0 ? (
        usersList.map((user) => (
          <div
            key={user.userId}
            className="card bg-gray-100 w-95 shadow-sm mb-3"
          >
            <div className="card-body text-center items-center">
              <div className="flex gap-1 items-baseline">
                <h1 className="card-title">Name:</h1>
                <p>{user.name}</p>
              </div>
              <div className="flex gap-1 items-baseline">
                <h1 className="card-title">Surname:</h1>
                <p>{user.surname}</p>
              </div>
              <div className="flex gap-1 items-baseline">
                <h1 className="card-title">Languages:</h1>
                <p> {JSON.parse(user.languages.toString()).join(" ")}</p>
              </div>
              <div className="card-actions">
                <AsyncButton 
                className="btn btn-accent w-30"
                isLoadingText="Processing..."
                isNormalText="Create room"
                func={() => handleRedirectToClassRoom(user.userId)}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No users found </div>
      )}
    </div>
  );
}
