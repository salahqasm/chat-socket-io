import jwt from "jsonwebtoken"
import { Response, Request, NextFunction } from 'express';
import { JWT_SECRET } from '../../config';
import { TUser } from "../../database/User";

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