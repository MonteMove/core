import { UserPayload } from '../types/user-payload.type';

declare global {
    namespace Express {
        interface Request {
            user: UserPayload;
        }
    }
}

export {};
