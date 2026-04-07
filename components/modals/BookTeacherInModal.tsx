import { useEffect, useState } from "react";
import ScheduleTable from "../ScheduleTable";
import { Selected } from "@/types/c-types";
import { fetchGet } from "@/utils/utils";
import { toSetSchedule } from "@/scripts/client";
import AsyncButton from "../buttons/AsyncBtn";

type BookTeacheInModalProps = {
  teacherId: string;
  userId: string;
  uploadToBook: (book: any) => Promise<void>;
};

export default function BookTeacherInModal({
  teacherId,
  userId,
  uploadToBook,
}: BookTeacheInModalProps) {
  const [teacherSchedule, setTeacherSchedule] = useState<Selected>(new Set());
  const [studentSchedule, setStudentSchedule] = useState<Selected>(new Set());

  useEffect(() => {
    if (teacherId) {
      fetchGet("/api/teacher-params", {
        "X-Teacher-Id": teacherId,
      }).then((teacher) => {
        setTeacherSchedule(toSetSchedule(teacher.user.event));
      });
    }
  }, [teacherId]);

  const loadStudentSchedule = async () => {
    const newBody = {
      teacherId: teacherId,
      studentId: userId,
      schedule: Array.from(studentSchedule),
    };
    await uploadToBook(newBody);
  };

  return (
    <div>
      <p>Choose your prefered time in the table</p>
      <ScheduleTable
        schedule={teacherSchedule}
        setSchedule={setStudentSchedule}
        studentSchedule={studentSchedule}
        mode="select"
      />
      <AsyncButton
        func={loadStudentSchedule}
        isLoadingText="Loading"
        isNormalText="Accept"
        className="btn btn-success"
      />
    </div>
  );
}
