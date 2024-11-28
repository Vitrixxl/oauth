import { Static, t } from 'elysia';
import { HttpErrorSchema } from '../../shared/errors';
import { PSW_PATTERN } from './password.schema';
import { AuthPayloadSchema } from './auth-payload.schema';

const RegisterRequestSchema = {
    body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({
            pattern: PSW_PATTERN,
        }),
        confPassword: t.String({
            pattern: PSW_PATTERN,
        }),
    }),
};
export type RegisterParams = Omit<
    Static<typeof RegisterRequestSchema.body>,
    'confPassword'
>;
// & { ipAddress: string };

const RegisterResponseSchema = {
    response: {
        201: AuthPayloadSchema,
        400: HttpErrorSchema,
        409: HttpErrorSchema,
    },
};
export const RegisterParamsSchema = {
    ...RegisterRequestSchema,
    ...RegisterResponseSchema,
};
