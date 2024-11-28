import Elysia from 'elysia';
import {
    LoginParamsSchema,
    LogoutResponseSchema,
    OAuthHandlerSchema,
    RegisterParamsSchema,
} from './schemas';
import { auth } from '../common/middleware/auth.middleware';
import { OAuthService } from './services/oauth.service';
import { AuthLocalService } from './services/auth-local.service';
import { AuthPayloadSchema } from './schemas/auth-payload.schema';

export const AuthController = new Elysia({ prefix: '/auth', tags: ['auth'] })
    // .use(auth)
    .post(
        '/register',
        async ({ body }) => await AuthLocalService.register(body),
        RegisterParamsSchema,
    )
    .post(
        '/login',
        async ({ body }) => await AuthLocalService.login(body),
        LoginParamsSchema,
    )
    .post(
        '/logout',
        async ({ headers, redirect }) => {
            await AuthLocalService.logout(headers);
            return redirect('http://locahost:5173', 302);
        },
        LogoutResponseSchema,
    )
    .group('/oauth', (app) =>
        app
            .post('/google', async ({ body: { code, verifier }, set }) => {
                const authData = await OAuthService.processOAuthFlow({
                    code,
                    verifier,
                    providerName: 'google',
                });
                set.status = 201;
                return authData;
            }, {
                body: OAuthHandlerSchema.body,
                response: {
                    201: AuthPayloadSchema,
                },
            }));
