// import jwt from 'jsonwebtoken';
// import { env } from '../env';
// import { User } from '../../db/tables/users';
//
// const JWT_SECRET = env.JWT_SECRET;
// const ACCESS_EXPIRES = '1d';
//
// export const generateToken = (user: Omit<User, 'password'>): string => {
//     return jwt.sign(user, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
// };
//
// export const verifyToken = (token: string): Omit<User, 'password'> | null => {
//     try {
//         return jwt.verify(token, JWT_SECRET) as Omit<User, 'password'>;
//     } catch {
//         return null;
//     }
// };
