import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  getTeacherFromDatabase: vi.fn(),
  createTeacherInDatabase: vi.fn(),
  createCerteficatesInDatabase: vi.fn(),
  createScheduleInDatabase: vi.fn(),
  updateTeacherInDatabase: vi.fn(),
  updateCerteficatesInDatabase: vi.fn(),
  updateScheduleInDatabase: vi.fn(),
}));

import { GET, POST } from "@/app/api/teacher-params/route";
import {
  getTeacherFromDatabase,
  createTeacherInDatabase,
  createCerteficatesInDatabase,
  createScheduleInDatabase,
  updateTeacherInDatabase,
  updateCerteficatesInDatabase,
  updateScheduleInDatabase,
} from "@/lib/database";

const mockGet = getTeacherFromDatabase as ReturnType<typeof vi.fn>;
const mockCreateTeacher = createTeacherInDatabase as ReturnType<typeof vi.fn>;
const mockCreateCerts = createCerteficatesInDatabase as ReturnType<typeof vi.fn>;
const mockCreateSchedule = createScheduleInDatabase as ReturnType<typeof vi.fn>;
const mockUpdateTeacher = updateTeacherInDatabase as ReturnType<typeof vi.fn>;
const mockUpdateCerts = updateCerteficatesInDatabase as ReturnType<typeof vi.fn>;
const mockUpdateSchedule = updateScheduleInDatabase as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/teacher-params", () => {
  it("returns teacher data by header ID", async () => {
    const teacher = { id: "t1", certificates: [] };
    mockGet.mockResolvedValueOnce(teacher);

    const req = new NextRequest("http://localhost/api/teacher-params", {
      headers: { "X-Teacher-Id": "t1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual(teacher);
    expect(mockGet).toHaveBeenCalledWith("t1");
  });
});

describe("POST /api/teacher-params – create operation", () => {
  it("creates teacher, certificates, and schedule", async () => {
    mockCreateTeacher.mockResolvedValueOnce({});
    mockCreateCerts.mockResolvedValueOnce({});
    mockCreateSchedule.mockResolvedValueOnce({});

    const body = {
      operation: "create",
      id: "t1",
      description: "Experienced",
      certificates: [{ name: "CELTA" }],
      schedule: ["Mon 09:00"],
    };
    const req = new NextRequest("http://localhost/api/teacher-params", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockCreateTeacher).toHaveBeenCalledWith({ id: "t1", description: "Experienced" });
    expect(mockCreateCerts).toHaveBeenCalledWith("t1", [{ name: "CELTA" }]);
    expect(mockCreateSchedule).toHaveBeenCalledWith("t1", ["Mon 09:00"]);
  });
});

describe("POST /api/teacher-params – update operation", () => {
  it("updates teacher, certificates, and schedule", async () => {
    mockUpdateTeacher.mockResolvedValueOnce({});
    mockUpdateCerts.mockResolvedValueOnce({});
    mockUpdateSchedule.mockResolvedValueOnce({});

    const body = {
      operation: "update",
      id: "t1",
      description: "Updated",
      certificates: [{ name: "DELTA" }],
      schedule: ["Tue 10:00"],
    };
    const req = new NextRequest("http://localhost/api/teacher-params", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockUpdateTeacher).toHaveBeenCalledWith("t1", { id: "t1", description: "Updated" });
    expect(mockUpdateCerts).toHaveBeenCalledWith("t1", [{ name: "DELTA" }]);
    expect(mockUpdateSchedule).toHaveBeenCalledWith("t1", ["Tue 10:00"]);
  });
});

describe("POST /api/teacher-params – error handling", () => {
  it("returns error when operation throws", async () => {
    mockCreateTeacher.mockRejectedValueOnce(new Error("DB fail"));

    const body = {
      operation: "create",
      id: "t1",
      certificates: [],
      schedule: [],
    };
    const req = new NextRequest("http://localhost/api/teacher-params", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json).toHaveProperty("error");
  });
});
