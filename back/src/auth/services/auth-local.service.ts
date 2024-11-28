import { password } from 'bun';
import { AUTH_TYPE } from '../../db/tables/auth/sessions';
import { HttpError } from '../../shared/errors';
import { ERROR_CODES } from '../../shared/errors/codes';
import { HTTP_STATUS_CODES } from '../../shared/errors/status-codes';
import { UserRepository } from '../repository';
import { LoginParams, RegisterParams } from '../schemas';
import { SessionService } from './session.service';
import { AuthPayload } from '../schemas/auth-payload.schema';
import { SessionHeader } from '../schemas/session-headers.schema';

export class AuthLocalService {
    static async register(
        credentials: RegisterParams,
    ): Promise<AuthPayload> {
        const exist = await UserRepository.exist(credentials.email);

        if (exist) {
            throw new HttpError({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                code: ERROR_CODES.AUTH.USER_ALREADY_EXIST,
                message: 'A user already exists with this email address',
            });
        }

        const hash = await password.hash(credentials.password);

        const user = await UserRepository.create({
            email: credentials.email,
            password: hash,
        });

        const session = await SessionService.generateSession(
            user.id,
            AUTH_TYPE.LOCAL,
        );

        return {
            user,
            sessId: session.id,
            sessToken: session.token,
        };
    }

    static async login(credentials: LoginParams): Promise<AuthPayload> {
        const user = await UserRepository.getOneBy({
            email: credentials.email,
        });
        if (!user) {
            throw new HttpError({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                code: ERROR_CODES.AUTH.USER_DOESNT_EXIST,
                message: 'No user found with this email address',
            });
        }
        if (!user.password) {
            throw new HttpError({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                code: ERROR_CODES.AUTH.INVALID_AUTH_PROVIDER,
                message: "The user isn't locally logged",
            });
        }
        const compared = await password.verify(
            credentials.password,
            user.password,
        );
        if (!compared) {
            throw new HttpError({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                code: ERROR_CODES.AUTH.INVALID_CREDENTIALS,
                message: 'Wrong password',
            });
        }

        const session = await SessionService.generateSession(
            user.id,
            AUTH_TYPE.LOCAL,
        );
        return {
            user,
            sessId: session.id,
            sessToken: session.token,
        };
    }

    static async logout(headers: Partial<SessionHeader>): Promise<void> {
        if (!headers['x-session-id'] || !headers.authorization) return;

        const isValid = await SessionService.verifySession({
            id: headers['x-session-id'],
            token: headers.authorization,
        });

        if (!isValid) return;

        await SessionService.revokeSessions([headers['x-session-id']]);
    }
}
