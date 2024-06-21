import { Socket } from "socket.io"

//Todo: implement secure rooms
// export type RoomAccessibilityType = "public" | "private"

export interface IRooms {
    [key: string]: IRoom
}

export interface IRoom {
    [key: string]: {
        username: string;
        socket: Socket
    };
}