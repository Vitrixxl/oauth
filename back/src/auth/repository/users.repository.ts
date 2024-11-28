import { and, count, eq } from 'drizzle-orm';
import db from '../../shared/db';
import { PartialUser, User, users } from '../../db/tables/auth/users';

interface GetOneUserParams {
    id?: string;
    email?: string;
}

export class UserRepository {
    /**
     * Insert the user and return the inserted user
     */
    static async create(user: PartialUser): Promise<User> {
        const [insertedUser] = await db.insert(users).values(user)
            .returning();
        return insertedUser;
    }

    static async getAll(): Promise<User[]> {
        return await db.select().from(users);
    }

    static async getById(id: string): Promise<User | null> {
        const [user] = await db.select().from(users).where(
            eq(users.id, id),
        );
        return user || null;
    }

    static async getOneBy(
        { id, email }: GetOneUserParams,
    ): Promise<User | null> {
        if (!id && !email) return null;

        const [user] = await db.select().from(users).where(
            and(
                id ? eq(users.id, id) : undefined,
                email ? eq(users.email, email) : undefined,
            ),
        );
        return user || null;
    }

    static async exist(
        email: string,
    ): Promise<boolean> {
        const result = await db.select({ count: count() }).from(users).where(
            eq(users.email, email),
        );
        return result[0].count > 0;
    }
}
