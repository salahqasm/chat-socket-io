import { Socket, Server as SocketIOServer } from "socket.io";
import { SocketRooms } from "./socketRooms";
import { SocketEventsEnum } from "../interfaces/socket";

export class SocketHandlerModel extends SocketRooms {
    private io: SocketIOServer;

    constructor(io: SocketIOServer) {
        super();
        this.io = io;
    }

    welcome = (socket: Socket) => {
        socket.emit(SocketEventsEnum.CONNECTION_STATUS, "connected");
        socket.emit(SocketEventsEnum.REQUEST, "room")
    }

}