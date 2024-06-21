import { Socket, Server as SocketIOServer } from "socket.io";
import { SocketRooms } from "./socketRooms";
import { ClientSocketEventEnum, SocketEventsEnum } from "../interfaces/socketEvent";
import { IClientJoinRoom, IClientLeaveRoom, IClientMessage } from "../interfaces/clientEvent";

export class SocketHandlerModel extends SocketRooms {

    constructor(io: SocketIOServer) {
        super(io);
    }

    welcome = (socket: Socket) => {
        socket.emit(SocketEventsEnum.CONNECTION_STATUS, { success: true });
        const availableRooms = Object.entries(this.getRooms()).map(([key, value]) => ({ roomName: key, usersCount: Object.keys(value).length }));
        socket.emit(SocketEventsEnum.AVAILABLE_ROOMS, availableRooms);
    }

    sendAvailableRooms = () => {
        const availableRooms = Object.entries(this.getRooms()).map(([key, value]) => ({ roomName: key, usersCount: Object.keys(value).length }));
        this.io.emit(SocketEventsEnum.AVAILABLE_ROOMS, availableRooms)
    }

    eventHandler = (socket: Socket) => {
        socket.on(ClientSocketEventEnum.CREATE_ROOM, (data) => this.handleCreateRoom(socket, data));

        socket.on(ClientSocketEventEnum.JOIN_ROOM, (data) => this.handleJoin(socket, data));

        socket.on(ClientSocketEventEnum.LEAVE_ROOM, (data) => this.handleLeave(socket, data));

        socket.on(ClientSocketEventEnum.MSG, (data) => this.handleMessage(data));

        socket.on(ClientSocketEventEnum.DISCONNECT, () => this.handleDisconnect(socket))
    }

    handleCreateRoom = (socket: Socket, data: IClientJoinRoom) => {
        const res = this.addRoom(data.roomName);
        if (res) {
            socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.CREATE_ROOM, success: true });
            this.sendAvailableRooms();
            this.handleJoin(socket, data);
        } else {
            socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.CREATE_ROOM, success: false })
        }
    }

    handleJoin = (socket: Socket, data: IClientJoinRoom) => {

        const res = this.addUser(data.roomName, data.userName, socket);
        if (res) {
            socket.join(data.roomName);
            this.io.to(data.roomName).emit(SocketEventsEnum.USER_JOINED, data.userName)

            socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.JOIN_ROOM, success: true })
        } else {
            socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.JOIN_ROOM, success: false })
        }

    }

    handleLeave = (socket: Socket, data: IClientLeaveRoom) => {
        const res = this.removeUser(data.roomName, data.userName);
        socket.leave(data.roomName)
        socket.emit(SocketEventsEnum.INFO, { event: ClientSocketEventEnum.LEAVE_ROOM, sucess: res })
        this.handleEmptyRoom(data.roomName)
    }

    handleMessage = (data: IClientMessage) => {
        this.io.to(data.roomName).emit(SocketEventsEnum.MSG, { from: data.userName, message: data.message })
    }

    handleEmptyRoom = (roomName: string): boolean => {
        const room = this.getRoom(roomName);
        if (room) {
            if (Object.keys(room).length) {
                return false;
            } else {
                this.removeRoom(roomName);
                this.sendAvailableRooms();
                return true;
            }
        } else {
            return false
        }
    }

    handleDisconnect = (socket: Socket) => {
        this.disconnect(socket);
    }

}