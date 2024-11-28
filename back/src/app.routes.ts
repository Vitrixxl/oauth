import Elysia from 'elysia';
import { AuthController } from './auth/auth.controller';
import { UserController } from './auth/user.controller';

export const AppRoutes = new Elysia()
    .use(AuthController)
    .use(UserController);
