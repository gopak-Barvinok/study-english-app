"use client";

import { v4 as uuidv4 } from 'uuid';

export const generateCallId = (): string => {
    return uuidv4();
}

export const getRandomNonZeroIndex = (arrayLength: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (arrayLength <= 1) {
        resolve(0);
        return;
      }
      
      let index;
      do {
        index = Math.floor(Math.random() * arrayLength);
      } while (index === 0); 
      
      resolve(index);
    }, 0); 
  });
};