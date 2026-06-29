"use client";

import Loading from "@/components/procedures/Loading";
import { calculateAge } from "@/scripts/client";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchGet } from "@/utils/utils";
import type { LanguageItem } from "@/types/c-types";
import ModalWindow from "@/components/modals/ModalWindow";
import BookTeacherInModal from "@/components/modals/BookTeacherInModal";

export default function CallsPage() {
  const [usersList, setTeachersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchGet("/api/teachers-list", {
        "X-Current-User-Id": user.id,
      })
        .then((teachers) => {
          console.log(teachers);
          setTeachersList(teachers);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [user]);

  const handleUploadToBook = async (newBody: any) => {
    const resp = await fetch("/api/book-lesson", {
      method: "POST",
      body: JSON.stringify(newBody),
    });
    if (resp.ok) {
      setSelectedTeacherId(null); 
      router.push("/app/chats");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto py-6 gap-4">
      {usersList.length > 0 ? (
        usersList.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-base-200 border border-base-300 rounded-2xl shadow-xl w-96 hover:-translate-y-1 transition-transform duration-300 animate-fade-in"
          >
            <div className="p-8 flex flex-col items-center gap-5">
              {teacher.user.image ? (
                <img
                  src={teacher.user.image}
                  alt="Avatar"
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-primary-content text-3xl font-bold">
                  {teacher.user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="w-full space-y-1.5 text-sm">
                <div className="flex gap-1 items-baseline">
                  <span className="font-semibold text-base-content">Name:</span>
                  <span className="text-base-content/70">
                    {teacher.user.name}
                  </span>
                </div>
                <div className="flex gap-1 items-baseline">
                  <span className="font-semibold text-base-content">
                    Surname:
                  </span>
                  <span className="text-base-content/70">
                    {teacher.user.surname}
                  </span>
                </div>
                <div className="flex gap-1 items-baseline">
                  <span className="font-semibold text-base-content">Age:</span>
                  <span className="text-base-content/70">
                    {calculateAge(teacher.user.age)}
                  </span>
                </div>
                <div className="flex gap-1 items-baseline flex-wrap">
                  <span className="font-semibold text-base-content">
                    Languages:
                  </span>
                  {teacher?.user.languages &&
                    (teacher?.user.languages as LanguageItem[]).map(
                      (item, i) => (
                        <span key={i} className="text-base-content/70">
                          {item?.languageName}: {item?.level}
                        </span>
                      ),
                    )}
                </div>
                <div className="flex gap-1 items-baseline">
                  <span className="font-semibold text-base-content">
                    Location:
                  </span>
                  <span className="text-base-content/70">
                    {teacher.user.location}
                  </span>
                </div>
                <div className="flex gap-1 items-baseline">
                  <span className="font-semibold text-base-content">
                    Timezone:
                  </span>
                  <span className="text-base-content/70">
                    {teacher?.user.timezone}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacherId(teacher.id)}
                className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
              >
                Book lesson
              </button>
              <ModalWindow
                modal={selectedTeacherId === teacher.id}
                modalState={(v) => !v && setSelectedTeacherId(null)}
              >
                <BookTeacherInModal 
                teacherId={teacher.id} 
                userId={user.id} 
                uploadToBook={handleUploadToBook}
                />
              </ModalWindow>
            </div>
          </div>
        ))
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-base-content/40 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-sm">No teachers found</p>
          <p className="text-xs">Check back later or adjust your preferences</p>
        </div>
      )}
    </div>
  );
}
