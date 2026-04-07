"use client";

import Loading from "@/components/procedures/Loading";
import { calculateAge } from "@/scripts/client";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchGet } from "@/utils/utils";
import type { LanguageItem } from "@/types/c-types";
import { gmtOffsetToString } from "@/scripts/client";
import ModalWindow from "@/components/modals/ModalWindow";
import BookTeacherInModal from "@/components/modals/BookTeacherInModal";

export default function CallsPage() {
  const [usersList, setTeachersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<boolean>(false);
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
      setModal(false);
      router.push("/app/chats");
    }
  };

  const handleClickToBook = (bool: boolean) => {
    setModal(bool);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="overflow-y-auto">
      {usersList.length > 0 ? (
        usersList.map((teacher) => (
          <div
            key={teacher.id}
            className="card bg-base-100 w-95 shadow-sm mb-3 items-center text-center"
          >
            <figure className="justify-center pt-5">
              <img
                src={teacher.user.image}
                alt="Avatar"
                className="rounded-xl"
              />
            </figure>
            <div className="card-body">
              <div className="items-start text-start">
                <div className="flex gap-1 items-baseline">
                  <h1 className="card-title">Name:</h1>
                  <p>{teacher.user.name}</p>
                </div>
                <div className="flex gap-1 items-baseline">
                  <h1 className="card-title">Surname:</h1>
                  <p>{teacher.user.surname}</p>
                </div>
                <div className="flex gap-1 items-baseline">
                  <h1 className="card-title">Age:</h1>
                  <p>{calculateAge(teacher.user.age)}</p>
                </div>
                <div className="flex gap-1 items-baseline">
                  <h1 className="card-title">Languages:</h1>
                  {teacher?.user.languages &&
                    (teacher?.user.languages as LanguageItem[]).map(
                      (item, i) => (
                        <p key={i}>
                          {item?.languageName}: {item?.level}
                        </p>
                      ),
                    )}
                </div>
                <div className="flex gap-1 items-baseline">
                  <h1 className="card-title">Location:</h1>
                  <p>{teacher.user.location}</p>
                </div>
                <div className="flex gap-1 items-baseline">
                  <h1 className="card-title">Timezone:</h1>
                  <p>{gmtOffsetToString(Number(teacher?.user.timezone))}</p>
                </div>
              </div>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-success"
                  onClick={() => handleClickToBook(true)}
                >
                  Book lesson
                </button>
              </div>
              <ModalWindow modal={modal} modalState={setModal}>
                <BookTeacherInModal uploadToBook={handleUploadToBook} teacherId={teacher.id} userId={user.id} />
              </ModalWindow>
            </div>
          </div>
        ))
      ) : (
        <div>No teachers found </div>
      )}
    </div>
  );
}
