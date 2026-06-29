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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium text-base-content/60">{children}</label>
  );
}

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
    if (!description || !user || !writtingAboutYourself || !pricePerHour || !experience || !schedule)
      return;

    const certificatesList = await Promise.all(
      certificates.map(async (cert) => {
        if (cert.scan && typeof cert.scan !== "string") {
          const formData = new FormData();
          formData.append("scan", cert.scan);
          const res = await fetch("/api/upload-certs", { method: "POST", body: formData });
          const data = await res.json();
          return { ...cert, scan: data.url };
        }
        return { ...cert, scan: typeof cert.scan === "string" ? cert.scan : null };
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

    if (resp.status === 200) {
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
          setCertificates(
            teacher.certificates.map((cert: CertificateFile) => ({
              name: cert.name,
              year: cert.year,
              scan: cert.scan,
              description: cert.description,
            })),
          );
          setSchedule(toSetSchedule(teacher.user.event));
        } else {
          setOperation("create");
        }
      });
    }
  }, [user]);

  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xl p-6 space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Teacher profile</h2>
        <p className="text-base-content/50 text-sm">Set up your teaching profile to start accepting students</p>
      </div>

      <div className="space-y-4">
        {/* Description */}
        <div className="space-y-1">
          <SectionLabel>Short description</SectionLabel>
          <textarea
            placeholder="Brief description shown on your profile"
            className="textarea textarea-bordered w-full"
            rows={2}
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* About */}
        <div className="space-y-1">
          <SectionLabel>About you</SectionLabel>
          <textarea
            placeholder="Tell students about your teaching style, experience, etc."
            className="textarea textarea-bordered w-full"
            rows={3}
            value={writtingAboutYourself ?? ""}
            onChange={(e) => setWrittingAboutYourself(e.target.value)}
          />
        </div>

        {/* Experience + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <SectionLabel>Experience (years)</SectionLabel>
            <input
              type="number"
              min={0}
              className="input input-bordered w-full"
              value={experience ?? ""}
              onChange={(e) => setExperience(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <SectionLabel>Price per hour (€)</SectionLabel>
            <input
              type="number"
              min={0}
              className="input input-bordered w-full"
              value={pricePerHour ?? ""}
              onChange={(e) => setPricePerHour(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Certificates */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>Certificates</SectionLabel>
            <button
              className="btn btn-ghost btn-xs rounded-lg border border-dashed border-base-300 hover:border-primary/50 hover:text-primary transition-colors duration-200"
              onClick={handleCertificateCount}
            >
              + Add certificate
            </button>
          </div>
          {certificates.map((cert, i) => (
            <AddCertificateComponent
              key={i}
              certificate={cert}
              onChange={(field, value) => handleCertificateChange(i, field, value)}
            />
          ))}
        </div>

        {/* Schedule */}
        <div className="space-y-2">
          <SectionLabel>Available time slots</SectionLabel>
          <p className="text-xs text-base-content/40">Drag to select the hours you're available</p>
          <ScheduleTable schedule={schedule} setSchedule={setSchedule} mode="edit" />
        </div>

        <AsyncButton
          func={handleSaveTeacher}
          isLoadingText="Saving..."
          isNormalText="Save teacher profile"
          className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
        />
      </div>

      <ModalWindow modal={modal} modalState={setModal}>
        <div className="text-center space-y-2 py-2">
          <div className="text-3xl">✓</div>
          <h3 className="font-semibold text-lg">Saved successfully</h3>
          <p className="text-base-content/55 text-sm">Your teacher profile has been updated.</p>
        </div>
      </ModalWindow>
    </div>
  );
}
