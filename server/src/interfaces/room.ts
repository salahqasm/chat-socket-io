import { Socket } from "socket.io"

//Todo: implement secure rooms
// export type RoomAccessibilityType = "public" | "private"

export interface IRoom {
    [key: string]: {
        [key: string]: {
            username:string;
            socket:Socket
        };
    }
}