import { Static, t } from 'elysia';

export const SessionHeadersSchema = t.Object({
    authorization: t.String({
        pattern: '^Bearer\s',
    }),
    'x-session-id': t.String(),
});
export type SessionHeader = Static<typeof SessionHeadersSchema>;
