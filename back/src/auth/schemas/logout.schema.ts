import { t } from 'elysia';
import { SessionHeadersSchema } from './session-headers.schema';

export const LogoutResponseSchema = {
    headers: t.Optional(SessionHeadersSchema),
    response: {
        302: t.Void(),
    },
    detail: {
        description: 'Redirect to home/login page',
    },
};
