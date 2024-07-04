import bcrypt from "bcrypt"
import { Response, Request } from 'express';
import { TUser, UserModelService } from '../../models/User';

export async function RegisterController(req: Request, res: Response) {
    try {
        const data = req.body as Omit<TUser, "id" | "createdAt">;
        const { username, password, email, fullName } = data;
        if (!username || !password || !email || !fullName) {
            return res.status(422).json({ success: false, error: "username, password, email and fullName  are required" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await UserModelService.create({ ...data, password: hashedPassword })

        if (!result.success) return res.status(409).json({ success: false, error: "UserAlreadyRegistered" })

        const userWithoutPassword = { ...result.data };
        delete userWithoutPassword.password;
        return res.status(201).json({ success: true, data: userWithoutPassword })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false })
    }
}