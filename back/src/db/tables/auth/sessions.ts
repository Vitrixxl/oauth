import {
    AnyPgColumn,
    boolean,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';
import { createdAndUpdatedColumns, enumColumn } from '../../utils';
import { oauthProviders } from './oauth/oauth-providers';
import { users } from './users';
import { createSelectSchema } from 'drizzle-typebox';
import { sql } from 'drizzle-orm';

export const AUTH_TYPE = {
    LOCAL: 'local',
    OAUTH: 'oauth',
} as const;

export type AuthType = typeof AUTH_TYPE[keyof typeof AUTH_TYPE];

export const sessions = pgTable('sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    token: text('token').notNull(),
    authType: enumColumn('auth_type', AUTH_TYPE).notNull(),
    providerId: uuid('provider_id').references(() => oauthProviders.id),
    revoked: boolean('revoked').default(false).notNull(),
    lastRotation: timestamp('last_rotation'),
    expiresAt: timestamp('expires_at').default(sql`NOW() + INTERVAL '30 days'`)
        .notNull(),
    previousSessionId: uuid('previous_session_id').references((): AnyPgColumn =>
        sessions.id
    ),
    createdAt: createdAndUpdatedColumns.createdAt,
});
export const SessionSchema = createSelectSchema(sessions);
export type Session = typeof sessions.$inferSelect;
export type PartialSession = typeof sessions.$inferInsert;
export type PopulatedSession = {
    session: Session;
    user: User;
};
