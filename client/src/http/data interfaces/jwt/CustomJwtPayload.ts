export interface CustomJwtPayload {
    id: number;
    userName: string;
    email: string;
    role: string;
    subscriber: boolean;
    iat: number;
    exp: number;
}
