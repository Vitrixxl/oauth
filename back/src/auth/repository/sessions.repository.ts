import { and, eq, inArray, sql } from 'drizzle-orm';
import db from '../../shared/db';
import {
    PartialSession,
    PopulatedSession,
    Session,
    sessions,
} from '../../db/tables/auth/sessions';
import { users } from '../../db/tables/auth/users';

export class SessionRepository {
    /**
     * Insert the session in the db then return the raw token
     */
    static async create(
        session: PartialSession,
    ): Promise<Session> {
        const [newSession] = await db
            .insert(sessions)
            .values(session)
            .returning();

        return newSession;
    }

    static async getSession(
        sessId: string,
    ): Promise<Session | null> {
        const [sess] = await db
            .select()
            .from(sessions)
            .where(eq(sessions.id, sessId))
            .limit(1);

        if (!sess) {
            return null;
        }
        return sess;
    }

    static async getPopulatedSession(
        sessId: string,
    ): Promise<PopulatedSession | null> {
        const [sess] = await db
            .select({ session: sessions, user: users })
            .from(sessions)
            .leftJoin(users, eq(sessions.userId, users.id))
            .where(eq(sessions.id, sessId))
            .limit(1);

        if (!sess.user || !sess.session) {
            return null;
        }
        return {
            user: sess.user,
            session: sess.session,
        };
    }

    /**
     * By default will return only the activeSession
     */
    static async getByUser(
        userId: string,
        onlyActive: boolean = true,
    ): Promise<Session[]> {
        const userSessions = await db.select().from(sessions).where(
            and(
                eq(sessions.userId, userId),
                onlyActive ? eq(sessions.revoked, false) : sql`1=1`,
            ),
        );
        return userSessions;
    }

    static async updateById(
        id: string,
        partialSess: PartialSession,
    ): Promise<Session> {
        const [session] = await db.update(sessions).set(partialSess).where(
            eq(sessions.id, id),
        ).returning();

        return session;
    }

    static async delete(id: string): Promise<boolean> {
        const r = await db.delete(sessions).where(eq(sessions.id, id));
        return Boolean(r.rowCount && r.rowCount > 1);
    }

    static async revokeSessions(id: string[]) {
        const revoked = await db.update(sessions).set({
            revoked: true,
        }).where(inArray(sessions.id, id));
        return Boolean(revoked.rowCount && revoked.rowCount > 0);
    }
}
