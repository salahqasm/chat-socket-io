
import { Socket } from "socket.io";
import { IRoom } from "../interfaces/room";

export class SocketRooms {
    private rooms: IRoom = {}

    addRoom = (room: string): boolean => {
        if (room in this.rooms) return false;
        console.log("** ", room, " added **")
        this.rooms[room] = {};
        return true
    }    
    
    removeRoom = (room: string): boolean => {
        if (!(room in this.rooms)) return false;
        delete this.rooms[room];
        return true;
    }

    addUser = (room: string, username: string, socket: Socket): boolean => {
        if (!(room in this.rooms))
            this.addRoom(room);    

        if (username in this.rooms[room]) return false;
        this.rooms[room][username] = socket;
        return true;
    }    

    removeUser=(room:string,username:string):boolean=>{
        if(!(room in this.rooms)) return false;
        if(!(username in this.rooms[room])) return false;
        delete this.rooms[room][username];
        return true;
    }

    getRooms = (): typeof this.rooms => {
        return this.rooms
    }

    getRoomsLength = (): number => {
        return Object.keys(this.rooms).length;
    }
}
