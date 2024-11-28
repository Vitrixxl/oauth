const generateCodeVerifier = () => {
    const array = new Uint32Array(56);
    crypto.getRandomValues(array);
    return Array.from(array, (dec) => ('0' + dec.toString(16)).slice(-2)).join(
        '',
    );
};

const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};
export const initializeGoogleAuth = async () => {
    try {
        const state = generateCodeVerifier();
        sessionStorage.setItem('state', state);

        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await sha256(codeVerifier);
        sessionStorage.setItem('codeVerifier', codeVerifier);

        const params = new URLSearchParams({
            client_id:
                '410287533326-ko68bbln5f5rn65hfq60t5ghven4cad3.apps.googleusercontent.com',
            redirect_uri: 'http://localhost:5173/callback/google',
            response_type: 'code',
            scope: 'email profile',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            state: state,
        });

        window.location.href =
            `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (error) {
        console.log(error);
    }
};

export const getMyInfo = async () => {
    const sessId = sessionStorage.getItem('sessId');
    const sessToken = sessionStorage.getItem('sessToken');
    if (!sessId || !sessToken) {
        window.location.pathname = '/';
        return;
    }

    const result = await fetch('http://localhost:3000/users/getmyprofile', {
        headers: {
            authorization: 'Bearer ' + sessToken,
            'x-session-id': sessId,
        },
    });

    const user = await result.json();

    console.log(user);

    return user;
};

export const getAllUserInfo = async () => {
    const sessId = sessionStorage.getItem('sessId');
    const sessToken = sessionStorage.getItem('sessToken');
    if (!sessId || !sessToken) {
        window.location.pathname = '/login';
        return;
    }

    const result = await fetch('http://localhost:3000/users/all', {
        headers: {
            authorization: 'Bearer ' + sessToken,
            'x-session-id': sessId,
        },
    });

    if (result.status == 401 || result.status == 403) {
        window.location.pathname = '/login';
        return;
    }

    const users = await result.json();

    console.log(users);

    return users as any[];
};
