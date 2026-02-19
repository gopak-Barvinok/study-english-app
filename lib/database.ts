import { prisma } from "@/lib/prisma";
import { User } from "next-auth";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id: id }
  });
};

export const createNewUser = async (user: User) => {
  return await prisma.user.create({
    data: {
      ...user,
    },
  });
};

export const updateUserInDatabase = async (id: string, data: any) => {
  await prisma.user.update({
    where: { id: id },
    data: {
      ...data,
    },
  });
};

export const getAllUsers = async (id: string, select?: any) => {
  return await prisma.user.findMany({
    where: {
      NOT: {
        id: id
      },
    },
    select: {
      ...select,
    },
  });
};

export const getSpecificCategory = async (id: string, role: string, select?: any) => {
  return await prisma.user.findMany({
    where: {
      NOT: {
        id: id,
      },
      role: role,
    },
    select: {
      ...select,
    },
  });
}

export const createRoom = async (room: any) => {
  await prisma.room.create({
    data: {
      ...room,
    },
  });
};

export const requestRoomParticipants = async (room_id: string) => {
  return await prisma.room.findUnique({
    where: { room_id: room_id },
    select: {
      participants_id: true,
    },
  })
}

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

export const inputGeneratedCards = async (participants_id: string[], cards: any[]) => {
  await prisma.user.updateMany({
    where: {
      id: {
        in: participants_id,
      }
    },
    data: {
      generatedCards: [...cards],
    },
  })
}

export const requestGeneratedCards = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      generatedCards: true,
    },
  })
}