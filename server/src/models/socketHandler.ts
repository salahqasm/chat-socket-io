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
        socket.emit(SocketEventsEnum.CONNECTION_STATUS, { success: true });
        const availableRooms = Object.entries(this.getRooms()).map(([key, value]) => ({ roomName: key, usersCount: Object.keys(value).length }));
        socket.emit(SocketEventsEnum.AVAILABLE_ROOMS, availableRooms);
    }

    eventHandler = (socket: Socket) => {
        socket.on(ClientSocketEventEnum.CREATE_ROOM, (data) => this.handleCreateRoom(socket, data));

        socket.on(ClientSocketEventEnum.JOIN_ROOM, (data) => this.handleJoin(socket, data));

        socket.on(ClientSocketEventEnum.LEAVE_ROOM, (data) => this.handleLeave(socket, data));

        socket.on(ClientSocketEventEnum.MSG, (data) => this.handleMessage(data));

        socket.on(ClientSocketEventEnum.DISCONNECT, () => this.disconnect(socket))
    }

    handleCreateRoom = (socket: Socket, data: JoinRoomDataType) => {
        const res = this.addRoom(data.roomName);
        socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.CREATE_ROOM, success: res })
        if (res) {
            socket.join(data.roomName);
            this.handleJoin(socket, data)
        }
    }

    handleJoin = (socket: Socket, data: JoinRoomDataType) => {
        const res = this.addUser(data.roomName, data.username, socket);
        if (res) {
            this.sendAvailableRooms();
            socket.join(data.roomName);
            this.io.to(data.roomName).emit(SocketEventsEnum.USER_JOINED, data.username)

            socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.JOIN_ROOM, success: true })
        } else {
            socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.JOIN_ROOM, success: false })
        }

    }

    handleLeave = (socket: Socket, data: LeaveRoomDataType) => {
        const res = this.removeUser(data.roomName, data.username);
        socket.leave(data.roomName)
        socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.LEAVE_ROOM, sucess: res })
    }

    handleMessage = (data: ClientMessageDataType) => {
        this.io.to(data.roomName).emit(SocketEventsEnum.MSG, { from: data.username, message: data.message })
    }

    sendAvailableRooms = () => {
        const availableRooms = Object.entries(this.getRooms()).map(([key, value]) => ({ roomName: key, usersCount: Object.keys(value).length }));
        this.io.emit(SocketEventsEnum.AVAILABLE_ROOMS, availableRooms)
    }
}