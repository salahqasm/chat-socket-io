import { Request } from 'express';
import { TUser } from '../src/models/User';

declare module 'express-serve-static-core' {
    interface Request {
        user?: Partial<TUser>;
    }
}