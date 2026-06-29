import { prisma } from "@/lib/prisma";
// import { User as DatabaseUser } from "@/generated/prisma";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id: id },
    include: {
      languages: true,
      event: true,
    },
  });
};

export const getUserRooms = async (userId: string) => {
  return await prisma.room.findMany({
    where: {
      participants: { some: { id: userId } },
    },
    include: {
      participants: {
        include: { languages: true, teacher: true },
      },
    },
    orderBy: {
      slot: "asc",
    },
  });
};

export const addTeacherRating = async (teacherId: string, rating: number, comment: string) => {
  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) return;

  await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      teacherRating: [
        ...(teacher.teacherRating as any[]),
        { rating, comment, createdAt: new Date().toISOString() },
      ],
    },
  });
};



export const createNewUser = async (user: any) => {
  return await prisma.user.create({
    data: {
      ...user,
    },
  });
};

export const createNewLanguages = async (id: string, languages: any[]) => {
  await prisma.language.createMany({
    data: languages.map((lang: any) => ({
      userId: id,
      languageName: lang.language,
      level: lang.level,
    })),
  });
}

export const updateUserInDatabase = async (id: string, data: any) => {
  await prisma.user.update({
    where: { id: id },
    data: {
      ...data,
    },
  });
};

export const createTeacherInDatabase = async (data: any) => {
  await prisma.teacher.create({
    data: {
      ...data,
    },
  });
};

export const createCerteficatesInDatabase = async (id: string, certs: any[]) => {
  await prisma.certificate.createMany({
    data: certs.map((cert) => ({
      teacherId: id,
      ...cert
    })),
  });
};

export const updateCerteficatesInDatabase = async (id: string, certs: any[]) => {
  await prisma.certificate.deleteMany({ where: { teacherId: id } });

  await prisma.certificate.createMany({
    data: certs.map((cert) => ({
      teacherId: id,
      name: cert.name,
      year: cert.year,
      description: cert.description,
      scan: cert.scan,
    })),
  });
};

export const updateTeacherInDatabase = async (id: string, data: any) => {
  const { id: _, ...rest } = data;
  await prisma.teacher.update({
    where: { id },
    data: rest,
  });
};

export const getTeacherFromDatabase = async (id: string) => {
  return await prisma.teacher.findUnique({
    where: {
      id: id,
    },
    include: {
      certificates: true,
      user: {
        include: {
          event: true,
          languages: true,
        },
      },
    },
  });
};

export const requestTeachersList = async (id: string) => {
  return await prisma.teacher.findMany({
    where: {
      NOT: {
        id: id,
      },
    },
    include: {
      user: {
        include: {
          languages: true,
        },
      },
      certificates: true,
    },
  });
}

export const createScheduleInDatabase = async (userId: string, data: any[]) => {
  await prisma.scheduleSlot.createMany({
    data: data.map(slot => ({ userId, slot: slot as string })),
  });
}

export const updateScheduleInDatabase = async (userId: string, slots: string[]) => {
  const existing = await prisma.scheduleSlot.findMany({
    where: { userId },
    select: { id: true, slot: true },
  });

  const existingSlots = new Set(existing.map((s) => s.slot));
  const newSlots = new Set(slots);

  const toDelete = existing
    .filter((s) => !newSlots.has(s.slot))
    .map((s) => s.id);

  const toCreate = slots.filter((s) => !existingSlots.has(s));

  if (toDelete.length > 0) {
    await prisma.scheduleSlot.deleteMany({ where: { id: { in: toDelete } } });
  }
  if (toCreate.length > 0) {
    await prisma.scheduleSlot.createMany({
      data: toCreate.map((slot) => ({ userId, slot })),
    });
  }
}

export const findChatBetweenUsers = async (userId1: string, userId2: string) => {
  return await prisma.chat.findFirst({
    where: {
      AND: [
        { participants: { some: { id: userId1 } } },
        { participants: { some: { id: userId2 } } },
      ],
    },
  });
};

export const createChat = async (participantIds: string[], channelId: string) => {
  await prisma.chat.create({
    data: {
      id: channelId,
      participants: {
        connect: participantIds.map((id) => ({ id }))
      }
    }
  })
}

export const getChats = async (userId: string) => {
  return await prisma.chat.findMany({
    where: {
      participants: {
        some: { id: userId },
      },
    },
    include: {
      messages: true,
      participants: true,
    },
  });
};

export const createAndUpdateMessages = async (data: any) => {
  await prisma.message.create({
      data: {
        ...data,
      },
    });
}

export const requestRoomParticipants = async (roomId: string) => {
  return await prisma.room.findMany({
    where: {
      room_id: roomId
    },
    include: {
      participants: true,
    },
  });
}

export const createRoom = async (roomId: string, participantIds: string[], slot: string) => {
  await prisma.room.create({
    data: {
      room_id: roomId,
      participants: {
        connect: participantIds.map((id) => ({id})),
      },
      slot: slot,
    },
  });
  await prisma.scheduleSlot.deleteMany({
    where: {
      userId: {
        in: participantIds
      },
      slot,
    }
  })
};

export const requestGeneratedCards = async (userId: string) => {
  return await prisma.generatedCard.findMany({
    where: {
      room: {
        participants: {
          some: { id: userId },
        },
      },
    },
  });
};

export const inputGeneratedCards = async (roomId: string, cards: any[]) => {
  if (!cards.length) return;
  await prisma.generatedCard.createMany({
    data: cards.map((card) => ({
      roomId,
      front: card.front ?? null,
      back: card.back ?? null,
      example: card.example ?? null,
      translation: card.translation ?? null,
      type: card.type ?? null,
    })),
  });
};

export const updateTranscribation = async (room_id: string, transcribation: string[]) => {
  await prisma.room.update({
    where: {
      room_id: room_id,
    },
    data: {
      transcribation: [...transcribation],
    }
  })
}
