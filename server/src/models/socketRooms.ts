
import { IRoom } from "../interfaces/room";

class SocketRooms {
    private rooms: string[] = []

    addRoom = (room: string): boolean => {
        if (this.rooms.includes(room)) return false;
        console.log("** ", room, " added **")
        this.rooms.push(room);
        return true
    }

    removeRoom = (room: string): boolean => {
        console.log("** ", room, " removed **")
        this.rooms = [...this.rooms.filter(pr => pr !== room)]
        return true
    }

    getRooms = (): typeof this.rooms => {
        return this.rooms
    }

    getRoomsLength = (): number => {
        return this.rooms.length;
    }
}