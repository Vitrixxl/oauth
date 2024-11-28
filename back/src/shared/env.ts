import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['test', 'developement', 'production']).default(
        'developement',
    ),
    PORT: z.string().default('3000'),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_PORT: z.string().default('5432'),
    POSTGRES_HOST: z.string(),
    JWT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);

export const DATABASE_URL =
    `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
