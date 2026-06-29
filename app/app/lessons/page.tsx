"use client";

import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { fetchGet } from "@/utils/utils";
import Loading from "@/components/procedures/Loading";

const DAY_LABELS: Record<string, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
  Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};

const DAY_INDEX: Record<string, number> = {
  Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0,
};

const getNextOccurrence = (dayKey: string): Date => {
  const today = new Date();
  const diff = (( DAY_INDEX[dayKey] ?? 0) - today.getDay() + 7) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return result;
};

const getAvgRating = (ratings: any[]): number | null => {
  if (!ratings?.length) return null;
  return ratings.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / ratings.length;
};

const formatSlot = (slot: string | null) => {
  if (!slot) return "No time set";
  const decoded = decodeURIComponent(slot);
  const [day, time] = decoded.split("-");
  const date = getNextOccurrence(day);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${DAY_LABELS[day] ?? day}, ${dateStr}, ${time}`;
};

export default function Lessons() {
  const { user } = useUserStore();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchGet("/api/user-rooms", { "X-User-Id": user.id })
      .then(setRooms)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loading />;

  if (rooms.length === 0) {
    return (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm">No lessons yet</p>
        <p className="text-xs">Book a lesson with a teacher to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center overflow-y-auto py-6 gap-4 animate-fade-in">
      {rooms.map((room) => {
        const companion = room.participants.find((p: any) => p.id !== user?.id);
        const avgRating = getAvgRating(companion?.teacher?.teacherRating);
        return (
          <div
            key={room.room_id}
            className="bg-base-200 border border-base-300 rounded-2xl shadow-xl w-96 hover:-translate-y-1 transition-transform duration-300 animate-fade-in"
          >
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden bg-primary flex items-center justify-center text-primary-content text-xl font-bold">
                {companion?.image ? (
                  <img src={companion.image} alt={companion.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  companion?.name?.[0]?.toUpperCase() ?? "?"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-semibold text-base-content truncate">
                    {companion?.name} {companion?.surname}
                  </p>
                  {avgRating !== null && (
                    <span className="shrink-0 text-xs text-warning font-medium flex items-center gap-0.5">
                      ★ {avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-base-content/50 mt-0.5">{formatSlot(room.slot)}</p>
                {companion?.languages?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {companion.languages.map((lang: any, i: number) => (
                      <span key={i} className="badge badge-sm badge-outline text-xs">
                        {lang.languageName}{lang.level ? ` · ${lang.level}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <a
                href={`/app/calling/${room.room_id}`}
                className="btn btn-primary btn-sm rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
              >
                Join
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
