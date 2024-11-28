import { t } from 'elysia';
import { ERROR_CODES, ErrorCode } from './codes';
import { ErrorStatusCode } from './status-codes';
type HttpErrorParams = {
    status: ErrorStatusCode;
    code: ErrorCode;
    message: string;
    details?: Record<string, any>;
};

export class HttpError extends Error {
    public readonly status: ErrorStatusCode;
    public readonly code: ErrorCode;
    public readonly details?: Record<string, any>;

    constructor({ status, code, message, details }: HttpErrorParams) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export const HttpErrorSchema = t.Object({
    status: t.Number(),
    code: t.Union(
        // Transforme les valeurs littérales en union de t.Literal
        Object.values(ERROR_CODES)
            .flatMap((domain) => Object.values(domain))
            .map((code) => t.Literal(code)),
    ),
    message: t.String(),
    details: t.Optional(t.Record(t.String(), t.Any())),
});
