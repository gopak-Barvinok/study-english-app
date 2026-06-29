import { Selected } from "@/types/c-types";
import { getScheduleCellClass } from "@/lib/classNames";
import { useRef, useEffect } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getWeekDates = (): Date[] => {
  const today = new Date();
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

type ScheduleTableProps = {
  schedule: Selected;
  setSchedule: React.Dispatch<React.SetStateAction<Selected>>;
  studentSchedule?: Selected;
  mode: "edit" | "select" | "watch";
};

export default function ScheduleTable({
  schedule,
  studentSchedule,
  setSchedule,
  mode,
}: ScheduleTableProps) {
  const isDragging = useRef(false);
  const dragAction = useRef<"add" | "remove">("add");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (schedule.size > 0 && containerRef.current) {
      const firstKey = Array.from(schedule)[0];
      const hour = firstKey.slice(firstKey.indexOf("-") + 1);
      const hourIndex = HOURS.indexOf(hour);
      if (hourIndex > 1) {
        const rowHeight = containerRef.current.scrollHeight / (HOURS.length + 1);
        containerRef.current.scrollTop = Math.max(0, (hourIndex - 1) * rowHeight);
      }
    }
  }, [schedule]);

  const getKey = (day: string, hour: string) => `${day}-${hour}`;

  const handleMouseDown = (day: string, hour: string) => {
    const key = getKey(day, hour);
    isDragging.current = true;
    dragAction.current = schedule.has(key) ? "remove" : "add";
    toggleCell(key);
  };

  const handleMouseEnter = (day: string, hour: string) => {
    if (!isDragging.current) return;
    toggleCell(getKey(day, hour));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const toggleCell = (key: string) => {
    setSchedule((prev) => {
      const next = new Set(prev);
      if (mode === "select") {
        next.clear();
        next.add(key);
      } else {
        dragAction.current === "add" ? next.add(key) : next.delete(key);
      }
      return next;
    });
  };

  const weekDates = getWeekDates();
  const weekLabel = `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div
      ref={containerRef}
      className="max-h-96 overflow-auto select-none rounded-xl border border-base-300"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="px-3 py-1.5 text-xs text-base-content/40 border-b border-base-300 sticky top-0 z-20 bg-base-200">
        {weekLabel}
      </div>
      <table className="table table-sm w-full">
        <thead className="sticky top-7 z-10 bg-base-200">
          <tr>
            <th className="text-base-content/50 text-xs w-12">Time</th>
            {DAYS.map((day, i) => (
              <th key={day} className="text-base-content/70 text-xs text-center">
                <div>{day}</div>
                <div className="text-base-content/40 font-normal">
                  {weekDates[i].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour}>
              <td className="text-xs text-base-content/40 w-12 py-1">{hour}</td>
              {DAYS.map((day) => {
                const key = `${day}-${hour}`;
                const isSelected = schedule.has(key);
                const isStudentSelected = studentSchedule?.has(key) ?? false;
                const isClickable = mode === "edit" || (mode === "select" && isSelected);
                return (
                  <td
                    key={day}
                    className={getScheduleCellClass(isStudentSelected, isSelected, isClickable, mode)}
                    onMouseDown={isClickable ? () => handleMouseDown(day, hour) : undefined}
                    onMouseEnter={isClickable ? () => handleMouseEnter(day, hour) : undefined}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
