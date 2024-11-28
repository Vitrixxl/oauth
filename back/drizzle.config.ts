import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/tables/**/*.ts',
    out: './src/db/migrations',
    dbCredentials: {
        url: 'postgresql://postgres:Vit%231371%2391@localhost:5432/fitcore',
    },
});
