import { timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 * Provid *createdAt* and *updatedAt* with both defaultNow()
 */
export const createdAndUpdatedColumns = {
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
        .notNull(),
};

export const enumColumn = <
    T extends { [K: string]: string },
    V extends T[keyof T],
>(
    columnName: string,
    enumObj: T,
    options?: {
        length?: number;
    },
) => {
    const enumValues = Object.values(enumObj) as [V, ...V[]];

    const maxLength = Math.max(...enumValues.map((v) => v.length));
    const length = options?.length ? options.length : maxLength;

    return varchar(columnName, {
        enum: enumValues,
        length,
    });
};
