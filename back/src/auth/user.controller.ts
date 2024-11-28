import Elysia, { t } from 'elysia';
import { UserService } from './services/user.service';
import { auth } from '../common/middleware/auth.middleware';
import { UserSchema } from '../db/tables/auth/users';

export const UserController = new Elysia({ prefix: '/users' })
    .use(auth)
    .get('/getmyprofile', ({ session }) => {
        return UserService.getSelf(session.user.id);
    }, {
        response: {
            200: t.Union([UserSchema, t.Null()]),
        },
    })
    .get('/all', async () => {
        return await UserService.getAll();
    }, {
        response: {
            200: t.Array(UserSchema),
        },
        role: ['admin'],
    });
