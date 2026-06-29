"use client";

import { useEffect, useState } from "react";
import { Selected } from "@/types/c-types";
import { toSetSchedule } from "@/scripts/client";
import AsyncButton from "../buttons/AsyncBtn";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

type BookTeacherInModalProps = {
  teacherId: string;
  userId: string;
  uploadToBook: (book: any) => Promise<void>;
};

export default function BookTeacherInModal({
  teacherId,
  userId,
  uploadToBook,
}: BookTeacherInModalProps) {
  const [teacherSchedule, setTeacherSchedule] = useState<Selected>(new Set());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (teacherId) {
      fetch("/api/teacher-params", { headers: { "X-Teacher-Id": teacherId } })
        .then((res) => res.json())
        .then((teacher) => {
          setTeacherSchedule(toSetSchedule(teacher.user.event));
        });
    }
  }, [teacherId]);

  const availableDays = DAYS.filter((day) =>
    HOURS.some((hour) => teacherSchedule.has(`${day}-${hour}`))
  );

  const availableHours = selectedDay
    ? HOURS.filter((hour) => teacherSchedule.has(`${selectedDay}-${hour}`))
    : [];

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
    setSelectedSlot(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedSlot(null);
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    await uploadToBook({ teacherId, studentId: userId, schedule: [selectedSlot] });
  };

  if (step === 1) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Choose a day</h2>
          <p className="text-base-content/55 text-sm mt-0.5">
            Highlighted days have available slots
          </p>
        </div>

        {availableDays.length === 0 ? (
          <p className="text-base-content/40 text-sm text-center py-8">
            No available slots
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {DAYS.map((day) => {
              const available = availableDays.includes(day);
              return (
                <button
                  key={day}
                  disabled={!available}
                  onClick={() => handleSelectDay(day)}
                  className={`btn btn-sm rounded-xl transition-all duration-200 ${
                    available
                      ? "btn-outline border-success text-success hover:bg-success hover:text-success-content hover:border-success hover:-translate-y-0.5"
                      : "btn-ghost text-base-content/25 cursor-not-allowed"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="btn btn-ghost btn-sm btn-circle text-base"
        >
          ←
        </button>
        <div>
          <h2 className="text-lg font-semibold">{DAY_LABELS[selectedDay!]}</h2>
          <p className="text-base-content/55 text-sm">Choose a time slot</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
        {availableHours.map((hour) => {
          const slot = `${selectedDay}-${hour}`;
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={hour}
              onClick={() => setSelectedSlot(isSelected ? null : slot)}
              className={`btn btn-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${
                isSelected
                  ? "btn-primary"
                  : "btn-outline border-success text-success hover:bg-success hover:text-success-content hover:border-success"
              }`}
            >
              {hour}
            </button>
          );
        })}
      </div>

      {selectedSlot && (
        <div className="animate-fade-in space-y-3 pt-1">
          <div className="flex items-center gap-2 text-sm text-base-content/60 bg-base-300/40 rounded-xl px-4 py-2.5">
            <span className="text-base">📅</span>
            <span>
              {DAY_LABELS[selectedDay!]} at{" "}
              <span className="font-semibold text-base-content">
                {selectedSlot.split("-")[1]}
              </span>
            </span>
          </div>
          <AsyncButton
            func={handleBook}
            isLoadingText="Booking..."
            isNormalText="Book lesson"
            className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
          />
        </div>
      )}
    </div>
  );
}
