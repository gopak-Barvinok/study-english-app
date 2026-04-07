"use client";

import ScheduleTable from "@/components/ScheduleTable";
import { toSetSchedule } from "@/scripts/client";
import { useUserStore } from "@/store/userStore";
import { Selected } from "@/types/c-types";
import { useEffect, useState } from "react";

export default function Lessons() {
  const { user } = useUserStore();
  const [schedule, setSchedule] = useState<Selected>(new Set());

  useEffect(() => {
    if(user) {
      setSchedule(toSetSchedule(user.event));
    }
  }, [user]);

  return (
    <div>
      <div className="font-extrabold">Your Schedule</div>
      <ScheduleTable
      schedule={schedule}
      setSchedule={setSchedule}
      mode="watch"
      />
    </div>
  );
}
