"use client";

import Loading from "@/components/procedures/Loading";
import { generateCallId } from "@/scripts/client";
import { useUserStore } from "@/store/userStore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import AsyncButton from "@/components/buttons/AsyncBtn";
import { fetchPost } from "@/utils/utils";

export default function CallsPage() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      const usersRequest = {
        role: "Teacher",
        exceptCurrentUserId: user.id,
        select: {
          id: true,
          name: true,
          surname: true,
          languages: true,
          role: true,
        },
      };
      fetchPost("/api/user-list", usersRequest)
        .then((users) => {
          console.log(users);
          setUsersList(users);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [user]);

  const handleRedirectToClassRoom = async (participantUserId: string) => {
    const callId = generateCallId();
    const body = {
      room_id: callId,
      participants_id: [user!.id, participantUserId],
      created_at: new Date(),
    };

    fetchPost("/api/room", body)
    .then(() => {
      return redirect(`/app/calling/${callId}`);
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      {usersList.length > 0 ? (
        usersList.map((user) => (
          <div key={user.id} className="card bg-base-100 w-95 shadow-sm mb-3">
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
                <p> {user.languages.join(" ")}</p>
              </div>
              <div className="card-actions">
                <AsyncButton
                  className="btn btn-accent w-30"
                  isLoadingText="Processing..."
                  isNormalText="Create room"
                  func={() => handleRedirectToClassRoom(user.id)}
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
