import { Selected } from "@/types/c-types";
import { useRef } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ScheduleTableProps = {
  schedule: Selected; // расписание учителя
  setSchedule: React.Dispatch<React.SetStateAction<Selected>>;
  studentSchedule?: Selected; // выбор студента
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

  const getKey = (day: string, hour: string) => `${day}-${hour}`;

  const handleMouseDown = (day: string, hour: string) => {
    const key = getKey(day, hour);
    isDragging!.current = true;
    dragAction!.current = schedule.has(key) ? "remove" : "add";
    toggleCell(key);
  };

  const handleMouseEnter = (day: string, hour: string) => {
    if (!isDragging!.current) return;
    toggleCell(getKey(day, hour));
  };

  const handleMouseUp = () => {
    isDragging!.current = false;
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

  return (
    <div
      className="max-h-96 overflow-auto select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Time</th>
            {DAYS.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour}>
              <td className="text-xs text-gray-400">{hour}</td>
              {DAYS.map((day) => {
                const key = `${day}-${hour}`;
                const isSelected = schedule.has(key); // зелёный — учитель
                const isStudentSelected = studentSchedule?.has(key);
                const isClickable =
                  mode === "edit" || (mode === "select" && isSelected);
                return (
                  <td
                    key={day}
                    style={{
                      backgroundColor: isStudentSelected
                        ? "rgba(180, 50, 50, 0.6)"
                        : isSelected
                          ? "rgba(74, 122, 74, 0.5)"
                          : "rgba(150, 150, 150, 0.2)",
                      cursor: isClickable ? "pointer" : "default",
                    }}
                    onMouseDown={
                      isClickable ? () => handleMouseDown(day, hour) : undefined
                    }
                    onMouseEnter={
                      isClickable
                        ? () => handleMouseEnter(day, hour)
                        : undefined
                    }
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
