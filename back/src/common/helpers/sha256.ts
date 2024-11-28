import { CryptoHasher } from 'bun';

export const sha256Async = async (text: string): Promise<string> => {
    const hasher = new CryptoHasher('sha256');
    return hasher.update(text).digest('hex');
};
