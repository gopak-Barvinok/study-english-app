"use client";

import ScheduleTable from "@/components/ScheduleTable";
import { toSetSchedule } from "@/scripts/client";
import { CertificateFile, Selected } from "@/types/c-types";
import { fetchGet } from "@/utils/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherPage() {
  const [teacher, setTeacher] = useState<any>();
  const [schedule, setSchedule] = useState<Selected>(new Set());
  const params = useParams();

  useEffect(() => {
    fetchGet("/api/get-teacher", {
      "X-Teacher-Id": params.id as string,
    }).then((teacher) => {
      console.log(teacher);
      setTeacher(teacher);
      setSchedule(toSetSchedule(teacher.user.event));
    });
  }, [params.id]);

  return (
    <div className="flex flex-col gap-8">
      {teacher && (
        <div>
          <div className="flex flex-row items-center gap-5">
            <div className="avatar">
              <div className="w-24 rounded">
                <img src={teacher.user.image} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-2xl">
                {teacher.user.name} {teacher.user.surname}
              </h1>
              <div>From: {teacher.user.location}</div>
            </div>
          </div>
          <div className="flex justify-baseline gap-1">
            <p>Describe yourself:</p>
            {teacher.description}
          </div>
          <div className="flex justify-baseline gap-1">
            <p>About me:</p>
            {teacher.writtingAboutYourself}
          </div>
          <div className="flex flex-row gap-3">
            <h1>My languages:</h1>
            {teacher.user.languages &&
              teacher.user.languages.map((lang: any, i: number) => (
                <div key={i}>
                  {lang.languageName} {lang.level}
                </div>
              ))}
          </div>
          <div>Reviews:</div>
          <div>
            Certificates:
            {teacher.certificates.map((cert: CertificateFile, i: number) => (
              <div key={i}>
                <div className="flex justify-baseline gap-1">
                  <p>Certificate's name: </p>
                  {cert.name}
                </div>
                <div className="flex justify-baseline gap-1">
                  <p>Description: </p>
                  {cert.description}
                </div>
                <div className="flex justify-baseline gap-1">
                  <p>Year: </p>
                  {cert.year}
                </div>
                {cert.scan && (
                  <div className="flex justify-baseline gap-1">
                    <p>Scan: </p>
                    <iframe src={cert.scan as string} width="100%" height="600px" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-baseline gap-1">
            <p>Prices:</p>
            {teacher.pricePerHour} EUR/hr
          </div>
          <div>
            <p>Schedule:</p>
            <ScheduleTable schedule={schedule} setSchedule={setSchedule} mode="edit" />
          </div>
        </div>
      )}
    </div>
  );
}
