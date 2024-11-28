import Elysia from 'elysia';
import { HttpError } from './shared/errors';

export const AppErrors = new Elysia()
    .onError(({ error, set }) => {
        if (error instanceof HttpError) {
            set.status = error.status;
            return error;
        }
    });
