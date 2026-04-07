"use client";

import { Selected } from '@/types/c-types';

export const gmtOffsetToString = (offset: number): string => {
    const sign = offset >= 0 ? '+' : '-'
    const abs = Math.abs(offset)
    const hours = Math.floor(abs / 3600)
    const minutes = Math.floor((abs % 3600) / 60)
    const hh = String(hours).padStart(2, '0')
    const mm = String(minutes).padStart(2, '0')

    return `UTC${sign}${hh}:${mm}`
}

export const returnLanguageWithLevels = (language: string): string[] => {
    switch (language) {
        case "Japanese":
            return ["N1", "N2", "N3", "N4", "N5", "Fluent", "Native"];
        case "Chinese":
            return [
                "HSK1",
                "HSK2",
                "HSK3",
                "HSK4",
                "HSK5",
                "HSK6",
                "HSK7",
                "HSK8",
                "HSK9", 
                "Fluent", 
                "Native"
            ];
        case "Korean":
            return ["TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6", "Fluent", "Native"];
        default:
            return ["A1", "A2", "B1", "B2", "C1", "C2", "Fluent", "Native"];
    }
}

export const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate)
    const today = new Date()

    let age = today.getFullYear() - birth.getFullYear()

    const hasHadBirthdayThisYear =
        today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())

    if (!hasHadBirthdayThisYear) age--

    return age
}

export const toSetSchedule = (schedule: any[]): Selected => {
    return new Set<string>(schedule.map((s: { slot: string }) => s.slot)) as Selected;
}