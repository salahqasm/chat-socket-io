import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Response, Request } from 'express';
import { UserModelService } from '../../models/User';
import { JWT_SECRET } from "../../config";

export async function LoginController(req: Request, res: Response) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(422).json({ success: false, error: "username and password are required" })
        }

        const result = await UserModelService.findByUsername(username)
        if (!result.success) return res.status(404).json({ success: false, error: "UserNotFound" })

        let isValidPassword = await bcrypt.compare(password, result.data?.password || "")
        if (!isValidPassword) return res.status(400).json({ success: false, error: "PasswordIncorrect" })

        const userWithoutPassword = { ...result.data };
        delete userWithoutPassword.password;
        const token = jwt.sign(userWithoutPassword, JWT_SECRET, {
            expiresIn: "4h"
        })

        return res.status(200).json({ success: true, data: { ...userWithoutPassword, token } })
    } catch (error) {
        return res.status(500).json({ success: false })
    }
}