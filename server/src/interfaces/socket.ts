export const SocketEventsEnum = {
    CONNECTION_STATUS: "connectionStatus",
    MSG: "message",
    USER_JOINED: "userJoined",
    USER_LEFT: "userLeft",
    REQUEST: "request",
    AVAILABLE_ROOMS: "availableRooms",
    INFO: "info"

}

export const ClientSocketEventEnum = {
    CREATE_ROOM:"createRoom",
    JOIN_ROOM: "joinRoom",
    LEAVE_ROOM: "leaveRoom",
    MSG: "message",
    DISCONNECT:"disconnect"
}

export type JoinRoomDataType = {
    roomName: string;
    username: string;
}

export type LeaveRoomDataType = {
    roomName: string;
    username: string;
}

export type ClientMessageDataType={
    roomName:string;
    message:string;
    username:string;
}