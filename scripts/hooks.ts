
import { useState, useEffect } from "react";

export const useLobbyState = (callId: string, initialState: boolean = true) => {
    const [isLobby, setIsLobby] = useState<boolean>(initialState);

    useEffect(() => {
        const saved = localStorage.getItem(`lobby-${callId}`);
        if(saved !== null) {
            setIsLobby(JSON.parse(saved));
        }
    }, [callId]);

    const setLobbyState = (value: boolean) => {
        setIsLobby(value);
        localStorage.setItem(`lobby-${callId}`, JSON.stringify(value));
    }

    return [isLobby, setLobbyState] as const;
}