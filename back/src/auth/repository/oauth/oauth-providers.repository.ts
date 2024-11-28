import { eq } from 'drizzle-orm';
import {
    OAuthProvider,
    oauthProviders,
    OAuthProviderType,
    PartialOAuthProvider,
} from '../../../db/tables/auth/oauth/oauth-providers';
import db from '../../../shared/db';

export class OAuthProvidersRepository {
    static async create(
        partialProvider: PartialOAuthProvider,
    ): Promise<OAuthProvider> {
        const [provider] = await db.insert(oauthProviders).values(
            partialProvider,
        ).returning();
        return provider;
    }

    static async getBy(
        { id, name }: { id?: string; name: OAuthProviderType },
    ): Promise<OAuthProvider | null> {
        if (id) {
            const [provider] = await db.select().from(oauthProviders).where(
                eq(oauthProviders.id, id),
            );
            return provider;
        } else if (name) {
            const [provider] = await db.select().from(oauthProviders).where(
                eq(oauthProviders.name, name),
            );
            return provider;
        }
        return null;
    }
    static async update(
        partialProvider: PartialOAuthProvider,
    ): Promise<OAuthProvider> {
        const [oauthProvider] = await db.update(oauthProviders).set(
            partialProvider,
        ).returning();
        return oauthProvider;
    }
    static async delete(id: string) {
        const r = await db.delete(oauthProviders).where(
            eq(oauthProviders.id, id),
        );
        return Boolean(r.rowCount && r.rowCount > 0);
    }
}
