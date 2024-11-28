import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAndUpdatedColumns, enumColumn } from '../../../utils';
import { sql } from 'drizzle-orm';

export const OAUTH_PROVIDERS = {
    GOOGLE: 'google',
} as const;

export type OAuthProviderType =
    typeof OAUTH_PROVIDERS[keyof typeof OAUTH_PROVIDERS];

export const oauthProviders = pgTable('oauth_providers', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: enumColumn('name', OAUTH_PROVIDERS).notNull(),
    isEnabled: boolean('is_enable').default(false),
    clientId: text('client_id').notNull(),
    clientSecret: text('client_secret').notNull(),
    scope: text('scopes').array(),
    redirectUri: text('redirect_url').array(),
    ...createdAndUpdatedColumns,
});

export type OAuthProvider = typeof oauthProviders.$inferSelect;
export type PartialOAuthProvider = typeof oauthProviders.$inferInsert;
