import { HttpError } from '../shared/errors';
import { HTTP_STATUS_CODES } from '../shared/errors/status-codes';
import { ERROR_CODES } from '../shared/errors/codes';

export function HandleServiceErrors<T extends (...args: any[]) => Promise<any>>(
    handler: T,
): T {
    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        try {
            return await handler(...args);
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }

            throw new HttpError({
                status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
                code: ERROR_CODES.SERVER.INTERNAL_SERVER_ERROR,
                message: 'An unexpected error occurred',
                details: {
                    originalError: error instanceof Error
                        ? error.message
                        : 'Unknown error',
                },
            });
        }
    }) as T;
}
