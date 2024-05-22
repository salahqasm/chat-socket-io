import { Socket, Server as SocketIOServer } from "socket.io";
import { SocketRooms } from "./socketRooms";
import { ClientMessageDataType, ClientSocketEventEnum, JoinRoomDataType, LeaveRoomDataType, SocketEventsEnum } from "../interfaces/socket";

export class SocketHandlerModel extends SocketRooms {
    private io: SocketIOServer;

    constructor(io: SocketIOServer) {
        super();
        this.io = io;
    }

    welcome = (socket: Socket) => {
        socket.emit(SocketEventsEnum.CONNECTION_STATUS, "connected");
        const availableRooms = Object.entries(this.getRooms()).map(([key, value]) => ({ roomName: key, usersCount: Object.keys(value).length }));
        socket.emit(SocketEventsEnum.AVAILABLE_ROOMS, availableRooms);
    }

    eventHandler = (socket: Socket) => {
        socket.on(ClientSocketEventEnum.JOIN_ROOM, (data) => this.handleJoin(socket, data));

        socket.on(ClientSocketEventEnum.LEAVE_ROOM, (data) => this.handleLeave(socket, data));

        socket.on(ClientSocketEventEnum.MSG, (data) => this.handleMessage(data));

        socket.on(ClientSocketEventEnum.DISCONNECT, (data) => console.log("DISCONNECTED",socket))
    }

    handleJoin = (socket: Socket, data: JoinRoomDataType) => {
        const res = this.addUser(data.roomName, data.username, socket);
        if (res) {
            this.sendAvailableRooms();
            socket.join(data.roomName);
            this.io.to(data.roomName).emit(SocketEventsEnum.USER_JOINED, data.username)

            socket.emit(SocketEventsEnum.INFO, "success")
        } else {
            socket.emit(SocketEventsEnum.INFO, "failed")
        }

    }

    handleLeave = (socket: Socket, data: LeaveRoomDataType) => {
        const res = this.removeUser(data.roomName, data.username);
        socket.leave(data.roomName)
        socket.emit(SocketEventsEnum.INFO, res ? "success" : "failed")
    }

    handleMessage = (data: ClientMessageDataType) => {
        this.io.to(data.roomName).emit(SocketEventsEnum.MSG, { from: data.username, message: data.message })
    }

    sendAvailableRooms = () => {
        const availableRooms = Object.entries(this.getRooms()).map(([key, value]) => ({ roomName: key, usersCount: Object.keys(value).length }));
        this.io.emit(SocketEventsEnum.AVAILABLE_ROOMS, availableRooms)
    }
}