import { Elysia, t } from 'elysia';

import { swagger } from '@elysiajs/swagger';

const app = new Elysia()
    .use(swagger())
    .guard(
        {
            headers: t.Object({
                authorization: t.TemplateLiteral('Bearer ${string}'),
            }),
        },
        (app) =>
            app
                .resolve(({ headers: { authorization } }) => {
                    return {
                        bearer: authorization.split(' ')[1],
                    };
                })
                .get('/', ({ bearer }) => bearer),
    )
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
