import { AUTH_ERROR_CODES } from './auth.codes';
import { SERVER_ERROR_CODES } from './server.codes';
import { USER_ERROR_CODES } from './user.codes';

export const ERROR_CODES = {
    AUTH: AUTH_ERROR_CODES,
    USER: USER_ERROR_CODES,
    SERVER: SERVER_ERROR_CODES,
} as const;



// Type pour les catégories (AUTH, USER, etc.)
// Type pour une catégorie (AUTH, USER)
type ErrorCodeCategory = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export type ValueOf<T> = T[keyof T];
export type ErrorCode = ValueOf<
    {
        [K in keyof typeof ERROR_CODES]: ValueOf<(typeof ERROR_CODES)[K]>;
    }
>;

/**
 * List of Https errors
 */
export type HttpErrorCode =
    // 4xx : Client Errors
    | 400
    | 401
    | 402
    | 403
    | 404
    | 405
    | 406
    | 407
    | 408
    | 409
    | 410
    | 411
    | 412
    | 413
    | 414
    | 415
    | 416
    | 417
    | 418
    | 422
    | 423
    | 424
    | 425
    | 426
    | 428
    | 429
    | 431
    | 451
    | // 5xx: Server Errors
    500
    | 501
    | 502
    | 503
    | 504
    | 505
    | 506
    | 507
    | 508
    | 510
    | 511;
