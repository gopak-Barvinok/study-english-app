"use client";

import { v4 as uuidv4 } from 'uuid';

export const generateCallId = (): string => {
    return uuidv4();
}