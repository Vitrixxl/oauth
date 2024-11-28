import { CryptoHasher, password } from 'bun';
import { SessionRepository } from '../repository';
import {
    AuthType,
    PopulatedSession,
    Session,
} from '../../db/tables/auth/sessions';
import { HttpError } from '../../shared/errors';
import { HTTP_STATUS_CODES } from '../../shared/errors/status-codes';

const MIN_SESSION_DURATION = 2 * 24 * 60 * 60 * 1000;

export interface SessTokenAndId {
    token: string;
    id: string;
}

export class SessionService {
    static async getSession(
        { id, token }: SessTokenAndId,
    ): Promise<PopulatedSession | null> {
        const verified = await this.verifySession({ id, token });
        if (!verified) return null;

        const session = await SessionRepository.getPopulatedSession(id);
        return session;
    }

    static async verifySession(
        { id, token }: SessTokenAndId,
    ): Promise<boolean> {
        const populatedSession = await SessionRepository.getPopulatedSession(
            id,
        );
        if (!populatedSession) return false;

        if (populatedSession.session.revoked) {
            return false;
        }
        const compared = await password.verify(
            token,
            populatedSession.session.token,
        );
        if (!compared) return false;
        return true;
    }

    static async generateSession(
        userId: string,
        authType: AuthType,
    ): Promise<SessTokenAndId> {
        const raw = this.generateToken();
        const hash = await password.hash(raw);
        const session = await SessionRepository.create({
            userId,
            authType,
            token: hash,
        });
        return { id: session.id, token: raw };
    }

    static async rotateSession(
        prevSession: Session,
    ): Promise<SessTokenAndId | null> {
        const session = await SessionRepository.getSession(prevSession.id);
        if (!session) return null;

        await SessionRepository.revokeSessions([prevSession.id]);

        return await this.generateSession(
            prevSession.userId,
            prevSession.authType,
        );
    }

    static async needsRotation(id: string): Promise<boolean> {
        const session = await SessionRepository.getSession(id);
        if (!session) return false;

        const expiresIn = Date.now() -
            session.expiresAt.getTime();

        return expiresIn < MIN_SESSION_DURATION;
    }

    static generateToken(): string {
        const hasher = new CryptoHasher('sha256');
        const timestamp = Date.now().toString();
        hasher.update(timestamp + Math.random().toString());
        return hasher.digest('hex');
    }

    static async revokeSessions(ids: string[]): Promise<boolean> {
        return await SessionRepository.revokeSessions(ids);
    }
    static async checkNullSession(session: Session | null) {
        if (!session) {
            throw new HttpError({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
            });
        }
    }
}
