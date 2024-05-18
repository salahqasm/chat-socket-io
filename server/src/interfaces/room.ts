import { Socket } from "socket.io"

export interface IRoom {
    [key: string]: {
        type: "public" | "private";
        users: {
            username: string;
            socket: Socket;
        }[]
    }
}