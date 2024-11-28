import { t } from 'elysia';
import { OAuthProviderType } from '../../../db/tables/auth/oauth/oauth-providers';
import { AuthPayloadSchema } from '../auth-payload.schema';
import { HttpErrorSchema } from '../../../shared/errors';

export const OAuthHandlerSchema = {
    body: t.Object({
        code: t.String(),
        verifier: t.String(),
    }),
    response: {
        201: AuthPayloadSchema,
        401: HttpErrorSchema,
    },
};
export type OAuthParams = {
    code: string;
    verifier: string;
    providerName: OAuthProviderType;
};
