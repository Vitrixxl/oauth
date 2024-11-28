import Elysia from 'elysia';

export const deviceInfo = new Elysia()
    .derive(({ headers }) => {
        return {
            device: headers['x-platform'] == 'mobile' ? 'mobile' : 'desktop',
        };
    }).as('plugin');
