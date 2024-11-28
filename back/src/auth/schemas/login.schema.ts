import { Static, t } from 'elysia';
import { HttpErrorSchema } from '../../shared/errors';
import { PSW_PATTERN } from './password.schema';
import { AuthPayloadSchema } from './auth-payload.schema';

const LoginRequestSchema = {
    body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({
            pattern: PSW_PATTERN,
        }),
    }),
};

export type LoginParams = Static<typeof LoginRequestSchema.body>;

export const LoginResponseSchema = {
    response: {
        201: AuthPayloadSchema,
        401: HttpErrorSchema,
        404: HttpErrorSchema,
    },
};

export const LoginParamsSchema = {
    ...LoginResponseSchema,
    ...LoginRequestSchema,
};
