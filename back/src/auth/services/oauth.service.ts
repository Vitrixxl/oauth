import { OAuthParams } from '../schemas/oauth/exchange.schema';
import { HttpError } from '../../shared/errors';
import { HTTP_STATUS_CODES } from '../../shared/errors/status-codes';
import { ERROR_CODES } from '../../shared/errors/codes';
import { GoogleOAuthService } from './oauth/providers/google-oauth.service';
import { ParsedOAuthPayload } from '../types';
import { OAuthProviderType } from '../../db/tables/auth/oauth/oauth-providers';
import { UserRepository } from '../repository';
import { SessionService } from './session.service';
import { AUTH_TYPE } from '../../db/tables/auth/sessions';
import { AuthPayload } from '../schemas/auth-payload.schema';

export class OAuthService {
    static async processOAuthFlow(
        { code, verifier, providerName }: OAuthParams,
    ): Promise<AuthPayload> {
        const payload = await this.getProviderPayload(
            code,
            verifier,
            providerName,
        );

        let user = await UserRepository.getOneBy({ email: payload.email });

        if (!user) {
            user = await UserRepository.create(payload);
        }

        const session = await SessionService.generateSession(
            user.id,
            AUTH_TYPE.OAUTH,
        );

        return {
            user,
            sessId: session.id,
            sessToken: session.token,
        };
    }

    /**
     * Switch case which return the payload depending on the provider
     */
    static async getProviderPayload(
        code: string,
        verifier: string,
        provider: OAuthProviderType,
    ): Promise<ParsedOAuthPayload> {
        let payload:
            | ParsedOAuthPayload
            | null = null;

        switch (provider) {
            case 'google':
                payload = await GoogleOAuthService.getPayload(code, verifier);
        }

        if (!payload) {
            throw new HttpError({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                code: ERROR_CODES.AUTH.UNACCESSIBLE_PROVIDER_INFO,
                message: 'Impossible to get user data from the provider',
                details: {
                    provider,
                },
            });
        }
        return payload;
    }
}
