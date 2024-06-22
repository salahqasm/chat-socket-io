import { Request } from 'express';
import { TUser } from '../src/model/User';

declare module 'express-serve-static-core' {
    interface Request {
        user?: Partial<TUser>;
    }
}