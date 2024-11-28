import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';
import { t } from 'elysia';
import { createdAndUpdatedColumns, enumColumn } from '../../utils';

export const USER_ROLES = {
    USER: 'user',
    COACH: 'coach',
    ADMIN: 'admin',
} as const;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const GENRES = {
    MEN: 'men',
    WOMEN: 'women',
    OTHER: 'other',
} as const;

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email').notNull(),
    password: text('password'),
    givenName: text('given_name'),
    familyName: text('family_name'),
    age: integer('age'),
    genre: enumColumn('genre', GENRES),
    role: enumColumn('role', USER_ROLES).default(USER_ROLES.USER).notNull(),
    ...createdAndUpdatedColumns,
});
export const UserSchema = createSelectSchema(users, {
    email: t.String({ format: 'email' }),
});

export type User = typeof users.$inferSelect;
export type PartialUser = typeof users.$inferInsert;
