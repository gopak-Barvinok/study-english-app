import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  mockUser,
  mockTeacher,
  mockCertificate,
  mockScheduleSlot,
  mockChat,
  mockMessage,
  mockRoom,
  mockGeneratedCard,
  mockLanguage,
} = vi.hoisted(() => ({
  mockUser: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  mockTeacher: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  mockCertificate: {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  mockScheduleSlot: {
    findMany: vi.fn(),
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  mockChat: {
    findFirst: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
  },
  mockMessage: {
    create: vi.fn(),
  },
  mockRoom: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  mockGeneratedCard: {
    findMany: vi.fn(),
    createMany: vi.fn(),
  },
  mockLanguage: {
    createMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: mockUser,
    teacher: mockTeacher,
    certificate: mockCertificate,
    scheduleSlot: mockScheduleSlot,
    chat: mockChat,
    message: mockMessage,
    room: mockRoom,
    generatedCard: mockGeneratedCard,
    language: mockLanguage,
  },
}));

import {
  getUserByEmail,
  getUserById,
  getUserRooms,
  addTeacherRating,
  createNewUser,
  createNewLanguages,
  updateUserInDatabase,
  createTeacherInDatabase,
  createCerteficatesInDatabase,
  updateCerteficatesInDatabase,
  updateTeacherInDatabase,
  getTeacherFromDatabase,
  requestTeachersList,
  createScheduleInDatabase,
  updateScheduleInDatabase,
  findChatBetweenUsers,
  createChat,
  getChats,
  createAndUpdateMessages,
  requestRoomParticipants,
  createRoom,
  requestGeneratedCards,
  inputGeneratedCards,
  updateTranscribation,
} from "@/lib/database";

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── User ────────────────────────────────────────────────────────────────────
describe("getUserByEmail", () => {
  it("returns user when found", async () => {
    const user = { id: "u1", email: "test@test.com" };
    mockUser.findUnique.mockResolvedValueOnce(user);
    const result = await getUserByEmail("test@test.com");
    expect(result).toEqual(user);
    expect(mockUser.findUnique).toHaveBeenCalledWith({ where: { email: "test@test.com" } });
  });

  it("returns null when not found", async () => {
    mockUser.findUnique.mockResolvedValueOnce(null);
    const result = await getUserByEmail("nobody@test.com");
    expect(result).toBeNull();
  });
});

describe("getUserById", () => {
  it("calls findUnique with id and includes languages and event", async () => {
    const user = { id: "u1", languages: [], event: [] };
    mockUser.findUnique.mockResolvedValueOnce(user);
    const result = await getUserById("u1");
    expect(result).toEqual(user);
    expect(mockUser.findUnique).toHaveBeenCalledWith({
      where: { id: "u1" },
      include: { languages: true, event: true },
    });
  });
});

describe("createNewUser", () => {
  it("creates and returns new user", async () => {
    const userData = { email: "new@test.com", name: "New" };
    const created = { id: "u2", ...userData };
    mockUser.create.mockResolvedValueOnce(created);
    const result = await createNewUser(userData);
    expect(result).toEqual(created);
    expect(mockUser.create).toHaveBeenCalledWith({ data: userData });
  });
});

describe("updateUserInDatabase", () => {
  it("updates user with given data", async () => {
    mockUser.update.mockResolvedValueOnce({});
    await updateUserInDatabase("u1", { name: "Updated" });
    expect(mockUser.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { name: "Updated" },
    });
  });
});

describe("createNewLanguages", () => {
  it("creates languages for user", async () => {
    mockLanguage.createMany.mockResolvedValueOnce({});
    await createNewLanguages("u1", [{ language: "English", level: "B2" }]);
    expect(mockLanguage.createMany).toHaveBeenCalledWith({
      data: [{ userId: "u1", languageName: "English", level: "B2" }],
    });
  });

  it("handles empty languages array", async () => {
    mockLanguage.createMany.mockResolvedValueOnce({});
    await createNewLanguages("u1", []);
    expect(mockLanguage.createMany).toHaveBeenCalledWith({ data: [] });
  });
});

// ─── Teacher ─────────────────────────────────────────────────────────────────
describe("createTeacherInDatabase", () => {
  it("creates a teacher record", async () => {
    mockTeacher.create.mockResolvedValueOnce({});
    const data = { id: "t1", userId: "u1" };
    await createTeacherInDatabase(data);
    expect(mockTeacher.create).toHaveBeenCalledWith({ data });
  });
});

describe("getTeacherFromDatabase", () => {
  it("finds teacher by id with certificates and user", async () => {
    const teacher = { id: "t1", certificates: [], user: {} };
    mockTeacher.findUnique.mockResolvedValueOnce(teacher);
    const result = await getTeacherFromDatabase("t1");
    expect(result).toEqual(teacher);
    expect(mockTeacher.findUnique).toHaveBeenCalledWith({
      where: { id: "t1" },
      include: {
        certificates: true,
        user: { include: { event: true, languages: true } },
      },
    });
  });
});

describe("requestTeachersList", () => {
  it("returns all teachers except current user", async () => {
    const teachers = [{ id: "t2" }, { id: "t3" }];
    mockTeacher.findMany.mockResolvedValueOnce(teachers);
    const result = await requestTeachersList("t1");
    expect(result).toEqual(teachers);
    expect(mockTeacher.findMany).toHaveBeenCalledWith({
      where: { NOT: { id: "t1" } },
      include: {
        user: { include: { languages: true } },
        certificates: true,
      },
    });
  });
});

describe("updateTeacherInDatabase", () => {
  it("updates teacher stripping the id field from data", async () => {
    mockTeacher.update.mockResolvedValueOnce({});
    await updateTeacherInDatabase("t1", { id: "t1", description: "Expert" });
    expect(mockTeacher.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { description: "Expert" },
    });
  });
});

describe("addTeacherRating", () => {
  it("appends rating to existing teacherRating array", async () => {
    const existing = { id: "t1", teacherRating: [{ rating: 4, comment: "good" }] };
    mockTeacher.findUnique.mockResolvedValueOnce(existing);
    mockTeacher.update.mockResolvedValueOnce({});

    await addTeacherRating("t1", 5, "excellent");

    expect(mockTeacher.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: {
        teacherRating: [
          ...existing.teacherRating,
          expect.objectContaining({ rating: 5, comment: "excellent" }),
        ],
      },
    });
  });

  it("returns early when teacher not found", async () => {
    mockTeacher.findUnique.mockResolvedValueOnce(null);
    await addTeacherRating("nonexistent", 5, "comment");
    expect(mockTeacher.update).not.toHaveBeenCalled();
  });
});

// ─── Certificates ─────────────────────────────────────────────────────────────
describe("createCerteficatesInDatabase", () => {
  it("creates certificates for teacher", async () => {
    mockCertificate.createMany.mockResolvedValueOnce({});
    const certs = [{ name: "CELTA", year: 2020, description: "cert", scan: "url" }];
    await createCerteficatesInDatabase("t1", certs);
    expect(mockCertificate.createMany).toHaveBeenCalledWith({
      data: certs.map((c) => ({ teacherId: "t1", ...c })),
    });
  });
});

describe("updateCerteficatesInDatabase", () => {
  it("deletes existing and creates new certificates", async () => {
    mockCertificate.deleteMany.mockResolvedValueOnce({});
    mockCertificate.createMany.mockResolvedValueOnce({});
    const certs = [{ name: "DELTA", year: 2021, description: "d", scan: "url2" }];
    await updateCerteficatesInDatabase("t1", certs);
    expect(mockCertificate.deleteMany).toHaveBeenCalledWith({ where: { teacherId: "t1" } });
    expect(mockCertificate.createMany).toHaveBeenCalledWith({
      data: certs.map((c) => ({ teacherId: "t1", ...c })),
    });
  });
});

// ─── Schedule ──────────────────────────────────────────────────────────────────
describe("createScheduleInDatabase", () => {
  it("creates schedule slots for user", async () => {
    mockScheduleSlot.createMany.mockResolvedValueOnce({});
    await createScheduleInDatabase("u1", ["Mon 09:00", "Tue 10:00"]);
    expect(mockScheduleSlot.createMany).toHaveBeenCalledWith({
      data: [
        { userId: "u1", slot: "Mon 09:00" },
        { userId: "u1", slot: "Tue 10:00" },
      ],
    });
  });
});

describe("updateScheduleInDatabase", () => {
  it("deletes removed slots and creates new ones", async () => {
    const existing = [
      { id: "s1", slot: "Mon 09:00" },
      { id: "s2", slot: "Tue 10:00" },
    ];
    mockScheduleSlot.findMany.mockResolvedValueOnce(existing);
    mockScheduleSlot.deleteMany.mockResolvedValueOnce({});
    mockScheduleSlot.createMany.mockResolvedValueOnce({});

    await updateScheduleInDatabase("u1", ["Tue 10:00", "Wed 11:00"]);

    expect(mockScheduleSlot.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["s1"] } },
    });
    expect(mockScheduleSlot.createMany).toHaveBeenCalledWith({
      data: [{ userId: "u1", slot: "Wed 11:00" }],
    });
  });

  it("skips delete when nothing to delete", async () => {
    mockScheduleSlot.findMany.mockResolvedValueOnce([]);
    mockScheduleSlot.createMany.mockResolvedValueOnce({});

    await updateScheduleInDatabase("u1", ["Mon 09:00"]);

    expect(mockScheduleSlot.deleteMany).not.toHaveBeenCalled();
    expect(mockScheduleSlot.createMany).toHaveBeenCalled();
  });

  it("skips createMany when nothing to add", async () => {
    const existing = [{ id: "s1", slot: "Mon 09:00" }];
    mockScheduleSlot.findMany.mockResolvedValueOnce(existing);
    mockScheduleSlot.deleteMany.mockResolvedValueOnce({});

    await updateScheduleInDatabase("u1", ["Mon 09:00"]);

    expect(mockScheduleSlot.createMany).not.toHaveBeenCalled();
  });
});

// ─── Rooms ────────────────────────────────────────────────────────────────────
describe("getUserRooms", () => {
  it("returns rooms for a user ordered by slot", async () => {
    const rooms = [{ room_id: "r1", participants: [] }];
    mockRoom.findMany.mockResolvedValueOnce(rooms);
    const result = await getUserRooms("u1");
    expect(result).toEqual(rooms);
    expect(mockRoom.findMany).toHaveBeenCalledWith({
      where: { participants: { some: { id: "u1" } } },
      include: { participants: true },
      orderBy: { slot: "asc" },
    });
  });
});

describe("requestRoomParticipants", () => {
  it("finds room by room_id with participants", async () => {
    const rooms = [{ room_id: "r1", participants: [{ id: "u1" }] }];
    mockRoom.findMany.mockResolvedValueOnce(rooms);
    const result = await requestRoomParticipants("r1");
    expect(result).toEqual(rooms);
  });
});

describe("createRoom", () => {
  it("creates room and deletes matching schedule slots", async () => {
    mockRoom.create.mockResolvedValueOnce({});
    mockScheduleSlot.deleteMany.mockResolvedValueOnce({});

    await createRoom("room-1", ["u1", "u2"], "Mon 09:00");

    expect(mockRoom.create).toHaveBeenCalledWith({
      data: {
        room_id: "room-1",
        participants: { connect: [{ id: "u1" }, { id: "u2" }] },
        slot: "Mon 09:00",
      },
    });
    expect(mockScheduleSlot.deleteMany).toHaveBeenCalledWith({
      where: { userId: { in: ["u1", "u2"] }, slot: "Mon 09:00" },
    });
  });
});

// ─── Chats ────────────────────────────────────────────────────────────────────
describe("findChatBetweenUsers", () => {
  it("finds existing chat between two users", async () => {
    const chat = { id: "c1" };
    mockChat.findFirst.mockResolvedValueOnce(chat);
    const result = await findChatBetweenUsers("u1", "u2");
    expect(result).toEqual(chat);
    expect(mockChat.findFirst).toHaveBeenCalledWith({
      where: {
        AND: [
          { participants: { some: { id: "u1" } } },
          { participants: { some: { id: "u2" } } },
        ],
      },
    });
  });

  it("returns null when no chat exists", async () => {
    mockChat.findFirst.mockResolvedValueOnce(null);
    const result = await findChatBetweenUsers("u1", "u3");
    expect(result).toBeNull();
  });
});

describe("createChat", () => {
  it("creates chat with given channelId and participants", async () => {
    mockChat.create.mockResolvedValueOnce({});
    await createChat(["u1", "u2"], "channel-1");
    expect(mockChat.create).toHaveBeenCalledWith({
      data: {
        id: "channel-1",
        participants: { connect: [{ id: "u1" }, { id: "u2" }] },
      },
    });
  });
});

describe("getChats", () => {
  it("returns chats for a user with messages and participants", async () => {
    const chats = [{ id: "c1", messages: [], participants: [] }];
    mockChat.findMany.mockResolvedValueOnce(chats);
    const result = await getChats("u1");
    expect(result).toEqual(chats);
    expect(mockChat.findMany).toHaveBeenCalledWith({
      where: { participants: { some: { id: "u1" } } },
      include: { messages: true, participants: true },
    });
  });
});

describe("createAndUpdateMessages", () => {
  it("creates a message record", async () => {
    mockMessage.create.mockResolvedValueOnce({});
    const data = { id: "m1", text: "Hello", chatId: "c1", senderId: "u1" };
    await createAndUpdateMessages(data);
    expect(mockMessage.create).toHaveBeenCalledWith({ data });
  });
});

// ─── Generated Cards ──────────────────────────────────────────────────────────
describe("requestGeneratedCards", () => {
  it("returns cards for rooms the user participated in", async () => {
    const cards = [{ id: "card1", front: "word" }];
    mockGeneratedCard.findMany.mockResolvedValueOnce(cards);
    const result = await requestGeneratedCards("u1");
    expect(result).toEqual(cards);
    expect(mockGeneratedCard.findMany).toHaveBeenCalledWith({
      where: { room: { participants: { some: { id: "u1" } } } },
    });
  });
});

describe("inputGeneratedCards", () => {
  it("creates generated cards for a room", async () => {
    mockGeneratedCard.createMany.mockResolvedValueOnce({});
    const cards = [
      { front: "word", back: "def", example: "ex", translation: "tr", type: "word" },
    ];
    await inputGeneratedCards("room-1", cards);
    expect(mockGeneratedCard.createMany).toHaveBeenCalledWith({
      data: cards.map((c) => ({
        roomId: "room-1",
        front: c.front,
        back: c.back,
        example: c.example,
        translation: c.translation,
        type: c.type,
      })),
    });
  });

  it("returns early without calling createMany when cards is empty", async () => {
    await inputGeneratedCards("room-1", []);
    expect(mockGeneratedCard.createMany).not.toHaveBeenCalled();
  });

  it("uses null for missing card fields", async () => {
    mockGeneratedCard.createMany.mockResolvedValueOnce({});
    await inputGeneratedCards("room-1", [{}]);
    const callData = mockGeneratedCard.createMany.mock.calls[0][0].data[0];
    expect(callData.front).toBeNull();
    expect(callData.back).toBeNull();
    expect(callData.example).toBeNull();
    expect(callData.translation).toBeNull();
    expect(callData.type).toBeNull();
  });
});

// ─── Transcribation ───────────────────────────────────────────────────────────
describe("updateTranscribation", () => {
  it("updates room transcribation", async () => {
    mockRoom.update.mockResolvedValueOnce({});
    await updateTranscribation("room-1", ["sentence 1", "sentence 2"]);
    expect(mockRoom.update).toHaveBeenCalledWith({
      where: { room_id: "room-1" },
      data: { transcribation: ["sentence 1", "sentence 2"] },
    });
  });
});
