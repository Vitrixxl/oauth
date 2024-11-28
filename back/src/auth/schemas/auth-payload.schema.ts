import { Static, t } from 'elysia';
import { UserSchema } from '../../db/tables/auth/users';

export const AuthPayloadSchema = t.Object({
    user: t.Omit(UserSchema, ['password']),
    sessToken: t.String(),
    sessId: t.String(),
});
export type AuthPayload = Static<typeof AuthPayloadSchema>;
