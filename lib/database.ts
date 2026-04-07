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
  await prisma.teacher.update({
    where: {
      id: id,
    },
    data: {
      ...data,
    },
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

export const updateScheduleInDatabase = async (studentId: string, teacherId: string, roomId: string, slot: string) => {
  
}

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
