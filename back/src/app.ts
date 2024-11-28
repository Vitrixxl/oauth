import swagger from '@elysiajs/swagger';
import { AppRoutes } from './app.routes';
import { Elysia } from 'elysia';
import logger from 'logixlysia';
import { env } from './shared/env';
import { AppErrors } from './app.errors';

const app = new Elysia()
    .use(logger())
    .use(
        swagger({
            exclude: ['/'],
            autoDarkMode: true,
            documentation: {
                info: {
                    title: 'Fit Core Api',
                    description: 'The best api for the best app',
                    version: '1.0.0',
                },
            },
        }),
    )
    .use(AppRoutes)
    .use(AppErrors);
app.listen({ port: env.PORT });
