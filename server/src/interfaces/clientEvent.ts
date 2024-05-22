export interface IClientBaseMessage{
    roomName:string;
    userName:string;
}

export interface IClientJoinRoom extends IClientBaseMessage  {
}

export interface IClientLeaveRoom extends IClientBaseMessage {

}

export interface IClientMessage extends IClientBaseMessage{
    message:string;
}