import Elysia from 'elysia';
import { SessTokenAndId } from '../../auth/services/session.service';

// const getTokenAndId = (
//     headers: Record<string, string | undefined>,
// ): SessTokenAndId | null => {
//     const authorization = headers['authorization'];
//     const id = headers['x-session-id'];
//
//     if (!authorization || !authorization.startsWith('Bearer')) {
//         return null;
//     }
//     if (!id) return null;
//     return {
//         token: authorization.split(' ')[1],
//         id,
//     };
// };
//

export const auth = new Elysia();
