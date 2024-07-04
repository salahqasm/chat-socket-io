import jwt from "jsonwebtoken"
import { Response, Request } from 'express';
import { TUser, UserModelService } from '../../models/User';
import { JWT_SECRET } from "../../config";

export async function VerifyTokenController(req: Request, res: Response) {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json({ success: false, error: 'AccessDenied' });

        const isValid = jwt.verify(token, JWT_SECRET)
        if (isValid) {
            return res.status(200).json({ success: true, data: isValid })
        }

    } catch (error) {
        return res.status(400).json({ success: false })
    }
}