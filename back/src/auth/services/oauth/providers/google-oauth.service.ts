import { OAuth2Client } from 'google-auth-library';
import { OAUTH_PROVIDERS } from '../../../../db/tables/auth/oauth/oauth-providers';
import { OAuthProvidersRepository } from '../../../repository/oauth/oauth-providers.repository';
import { GoogleOauthPayload } from '../../../types';
import { HttpError } from '../../../../shared/errors';
import { HTTP_STATUS_CODES } from '../../../../shared/errors/status-codes';
import { ERROR_CODES } from '../../../../shared/errors/codes';

export class GoogleOAuthService {
    static async getToken(
        code: string,
        verifier: string,
        client: OAuth2Client,
    ): Promise<string> {
        const { tokens: { id_token } } = await client.getToken({
            code,
            codeVerifier: verifier,
        });

        if (!id_token) {
            throw new HttpError({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                code: ERROR_CODES.AUTH.NOT_ALLOWED,
                message: 'Invalid verifier',
            });
        }

        return id_token;
    }

    static async getPayload(
        code: string,
        verifier: string,
    ): Promise<GoogleOauthPayload | null> {
        const provider = await OAuthProvidersRepository.getBy({
            name: OAUTH_PROVIDERS.GOOGLE,
        });

        if (!provider || !provider.redirectUri) return null;

        const client = new OAuth2Client(
            provider.clientId,
            provider.clientSecret,
            provider.redirectUri[0],
        );
        const token = await this.getToken(code, verifier, client);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: provider.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) return null;

        const parsedPayload: GoogleOauthPayload = {
            email: payload.email,
            givenName: payload.given_name,
            familyName: payload.family_name,
            picture: payload.picture,
            metadata: payload,
        };

        return parsedPayload;
    }
}
