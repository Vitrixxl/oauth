import { TokenPayload } from 'google-auth-library';

export interface ParsedOAuthPayload {
    email: string;
    givenName?: string;
    familyName?: string;
    picture?: string;
}

export interface GoogleOauthPayload extends ParsedOAuthPayload {
    metadata: TokenPayload;
}
