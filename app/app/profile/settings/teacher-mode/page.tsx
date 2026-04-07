"use client";

import AsyncButton from "@/components/buttons/AsyncBtn";
import AddCertificateComponent from "@/components/CertificateComponent";
import ModalWindow from "@/components/modals/ModalWindow";
import ScheduleTable from "@/components/ScheduleTable";
import { toSetSchedule } from "@/scripts/client";
import { useUserStore } from "@/store/userStore";
import { CertificateFile, Selected } from "@/types/c-types";
import { fetchGet, fetchPost } from "@/utils/utils";
import { useEffect, useState, useRef } from "react";

export default function TeacherModePage() {
  const { user } = useUserStore();
  const [operation, setOperation] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [writtingAboutYourself, setWrittingAboutYourself] = useState<string>();
  const [certificates, setCertificates] = useState<CertificateFile[]>([]);
  const [pricePerHour, setPricePerHour] = useState<number>();
  const [experience, setExperience] = useState<number>();
  const [schedule, setSchedule] = useState<Selected>(new Set());
  const [modal, setModal] = useState<boolean>(false);

  const handleCertificateCount = () => {
    setCertificates((prev) => [
      ...prev,
      { year: "", name: "", description: "", scan: null },
    ]);
  };

  const handleCertificateChange = (
    index: number,
    field: keyof CertificateFile,
    value: string | File | null,
  ) => {
    setCertificates((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSaveTeacher = async () => {
    if (
      !description ||
      !user ||
      !writtingAboutYourself ||
      !pricePerHour ||
      !experience ||
      !schedule
    )
      return;

    const certificatesList = await Promise.all(
      certificates.map(async (cert) => {
        if (cert.scan && typeof cert.scan !== "string") {
          const formData = new FormData();
          formData.append("scan", cert.scan);
          const res = await fetch("/api/upload-certs", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          return { ...cert, scan: data.url };
        } else if (cert.scan && typeof cert.scan === "string") {
          return { ...cert };
        }
        return { ...cert, scan: null };
      }),
    );

    const newBody = {
      id: user.id,
      operation: operation,
      description: description,
      writtingAboutYourself: writtingAboutYourself,
      certificates: certificatesList,
      experience: experience.toString(),
      pricePerHour: pricePerHour.toString(),
      schedule: Array.from(schedule),
    };

    const resp = await fetchPost("/api/teacher-params", newBody);

    if (resp.status == 200) {
      setModal(true);
    } else {
      alert(resp.error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGet("/api/teacher-params", {
        "X-Teacher-Id": user.id,
      }).then((teacher) => {
        if (teacher) {
          setOperation("update");
          setDescription(teacher.description);
          setWrittingAboutYourself(teacher.writtingAboutYourself);
          setPricePerHour(teacher.pricePerHour);
          setExperience(teacher.experience);
          setCertificates((_) => [
            ...teacher.certificates.map((cert: CertificateFile) => ({
              name: cert.name,
              year: cert.year,
              scan: cert.scan,
              description: cert.description,
            })),
          ]);
          setSchedule(toSetSchedule(teacher.user.event));
        } else {
          setOperation("create");
        }
      });
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-96">
      <div className="font-extrabold">Teacher settings</div>
      <p>Feel free to try as a teacher yourself</p>
      <div className="flex flex-col">
        <div>
          <h1>Description</h1>
          <textarea
            placeholder="Description"
            className="textarea textarea-info"
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <h1>Write about yourself</h1>
          <textarea
            placeholder="About you"
            className="textarea textarea-info"
            value={writtingAboutYourself ?? ""}
            onChange={(e) => setWrittingAboutYourself(e.target.value)}
          />
        </div>
        <div>
          <p>Set your experience</p>
          <input
            type="number"
            className="input"
            value={experience ?? ""}
            onChange={(e) => setExperience(Number(e.target.value))}
          />
        </div>
        <div>
          <h1 className="font-extrabold">Certificates</h1>
          {certificates &&
            certificates.map((cert, i) => (
              <div key={i}>
                <AddCertificateComponent
                  certificate={cert}
                  onChange={(field, value) =>
                    handleCertificateChange(i, field, value)
                  }
                />
              </div>
            ))}
          <button
            className="btn btn-success"
            onClick={() => handleCertificateCount()}
          >
            Add certificate
          </button>
        </div>
        <div>
          <p>Enter your price/hour in EUR</p>
          <input
            type="number"
            className="input"
            value={pricePerHour ?? ""}
            onChange={(e) => setPricePerHour(Number(e.target.value))}
          />
        </div>
        <div>
          <p>Select your available days</p>
          <ScheduleTable 
          schedule={schedule} 
          setSchedule={setSchedule}
          mode="edit"
          />
        </div>
        <AsyncButton
          func={handleSaveTeacher}
          isLoadingText="Saving your teacher's data"
          isNormalText="Save your data"
          className="btn btn-success"
        />
      </div>
        <ModalWindow modal={modal} modalState={setModal}>
          <div>Saved success</div>
        </ModalWindow>
    </div>
  );
}
