import jwt from "jsonwebtoken"
import { Response, Request, NextFunction } from 'express';
import { JWT_SECRET } from '../config';
import { TUser } from "../models/User";
import { ExtendedError } from "socket.io/dist/namespace";
import { Socket } from "socket.io";

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'AccessDenied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as Partial<TUser>;
        req.user = decoded;

        next();
    } catch (err) {
        res.status(400).json({ error: 'InvalidToken' });
    }
};

export function SocketAuthMiddleware(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    const token = socket.handshake.headers.authorization || "";
    console.log("called")
    // console.log
    if (!token) {
        next(new Error("no token"))
        // return socket.disconnect();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as Partial<TUser>;
        next();
    } catch (err) {
        next(new Error("unauth"))
        // return socket.disconnect()
    }
};