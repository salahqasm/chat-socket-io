import { prismaClient } from "../../prisma"
import { IDBResponse } from "../interfaces/dbModalsRes"

export type TUser = {
    id: string
    fullName: string
    username: string
    email: string
    password: string
    createdAt: Date
}

class UserModel {
    private dbClient = prismaClient

    async create(userData: Omit<TUser, "id" | "createdAt">): Promise<IDBResponse<Partial<TUser>>> {
        try {
            const res = await this.dbClient.user.create({ data: userData })
            return { success: true, data: res }
        } catch (error) {
            return { success: false }
        }
    }
    async findByUsername(username: string): Promise<IDBResponse<TUser>> {
        try {
            const res = await this.dbClient.user.findUnique({ where: { username: username } })
            if (res)
                return { success: true, data: res }
            else
                throw new Error("user not found")
        } catch (error) {
            return { success: false }
        }
    }

    async findByEmail(email: string): Promise<IDBResponse<TUser>> {
        try {
            const res = await this.dbClient.user.findUnique({ where: { email: email } })
            if (res)
                return { success: true, data: res }
            else
                throw new Error("user not found")
        } catch (error) {
            return { success: false }
        }
    }

    async findById(id: string): Promise<IDBResponse<TUser>> {
        try {
            const res = await this.dbClient.user.findUnique({ where: { id: id } })
            if (res)
                return { success: true, data: res }
            else
                throw new Error("user not found")
        } catch (error) {
            return { success: false }
        }
    }

    async delete(userId: string): Promise<IDBResponse<Partial<TUser>>> {
        try {
            const res = await this.dbClient.user.delete({ where: { id: userId } })
            return { success: true, data: res }
        } catch (error) {
            return { success: false }
        }
    }
}

export const UserModelService = new UserModel();