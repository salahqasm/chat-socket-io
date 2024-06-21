
import { Server, Socket } from "socket.io";
import { IRooms, IRoom } from "../interfaces/room";
import { SocketEventsEnum } from "../interfaces/socketEvent";

export class SocketRooms {
    private rooms: IRooms = {}

    public io: Server
    constructor(server: Server) {
        this.io = server;
    }

    addRoom = (room: string): boolean => {
        if (room in this.rooms) return false;
        console.log("** ", room, " added **")
        this.rooms[room] = {};
        return true
    }
    getRoom = (room: string): IRoom | null => {
        if (room in this.rooms) return this.rooms[room];
        return null
    }
    removeRoom = (room: string): boolean => {
        if (!(room in this.rooms)) return false;
        delete this.rooms[room];
        console.log("-- ",room," deleted --")
        this.io.of("/").adapter.rooms.delete(room)
        return true;
    }

    addUser = (room: string, username: string, socket: Socket): boolean => {
        if (!(room in this.rooms))
            return false;

        if (socket.id in this.rooms[room]) return false;
        this.rooms[room][socket.id] = { username: username, socket };
        console.log("! user joined: ", username,", room: ",room)
        return true;
    }

    removeUser = (room: string, socket:Socket): boolean => {
        if (!(room in this.rooms)) return false;
        if (!(socket.id in this.rooms[room])) return false;
        console.log("! user left: ", this.rooms[room][socket.id].username,", room: ",room)
        delete this.rooms[room][socket.id];
        return true;
    }

    getRooms = (): typeof this.rooms => {
        return this.rooms
    }

    getRoomsLength = (): number => {
        return Object.keys(this.rooms).length;
    }

    disconnect = (socket: Socket): boolean => {
        let room = Object.keys(this.rooms).filter(roomKey => this.rooms[roomKey][socket.id])[0];
        if (room) {
            this.io.to(room).emit(SocketEventsEnum.USER_LEFT, this.rooms[room][socket.id].username)
            delete this.rooms[room][socket.id]
            if (Object.keys(this.rooms[room]).length == 0) {
                this.removeRoom(room)
            }
            return true;
        } else {
            return false;
        }
    }
}
