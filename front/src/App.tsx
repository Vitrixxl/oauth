import { useEffect, useState } from 'react';
import { LucideChrome } from 'lucide-react';
import axios from 'axios';

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

function App() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confPassword: '',
    });
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const storedVerifier = sessionStorage.getItem('codeVerifier');

            if (code && storedVerifier && !localStorage.getItem('token')) {
                try {
                    const tokenResponse = await axios.post(
                        'https://oauth2.googleapis.com/token',
                        {
                            code,
                            client_id:
                                '410287533326-ko68bbln5f5rn65hfq60t5ghven4cad3.apps.googleusercontent.com',
                            code_verifier: storedVerifier,
                            grant_type: 'authorization_code',
                            redirect_uri: window.location.origin,
                        },
                    );

                    const backendResponse = await axios.post(
                        `http://localhost:5173/auth/oauth/google`,
                        {
                            id_token: tokenResponse.data.id_token,
                        },
                    );

                    localStorage.setItem('token', backendResponse.data.token);
                    sessionStorage.removeItem('codeVerifier');
                    window.history.replaceState(
                        {},
                        document.title,
                        window.location.pathname,
                    );
                } catch (err) {
                    console.log(err);
                    setError("Échec de l'authentification Google");
                    setTimeout(() => {
                        setError('');
                    }, 7000);
                }
            }
        };

        checkAuth();
    }, []);

    const initiateGoogleLogin = async () => {
        try {
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await sha256(codeVerifier);
            sessionStorage.setItem('codeVerifier', codeVerifier);

            const params = new URLSearchParams({
                client_id:
                    '410287533326-ko68bbln5f5rn65hfq60t5ghven4cad3.apps.googleusercontent.com',
                redirect_uri: 'http://localhost:5173',
                response_type: 'code',
                scope: 'email profile',
                code_challenge: codeChallenge,
                code_challenge_method: 'S256',
            });

            window.location.href =
                `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        } catch (error) {
            setError("Erreur lors de l'initialisation de la connexion Google");
        }
    };

    // Reste du composant identique (handleLogin, handleSignup, render)...

    return (
        <div className='flex items-center justify-center h-dvh flex-col gap-10'>
            {error && (
                <div className='text-red-500 bg-red-100 p-3 rounded'>
                    {error}
                </div>
            )}
            <div>
                {isLogin
                    ? (
                        <div className='p-10 rounded-xl border-2 border-zinc-600 bg-zinc-900 flex flex-col gap-8'>
                            <h1 className='text-white text-center text-3xl font-semibold'>
                                Se connecter
                            </h1>
                            <input
                                name='email'
                                type='email'
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })}
                                className='px-4 py-2 rounded-lg'
                                placeholder='Email'
                            />
                            <input
                                name='password'
                                type='password'
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })}
                                className='px-4 py-2 rounded-lg'
                                placeholder='Mot de passe'
                            />
                            <button className='bg-purple-600 px-4 py-2 rounded-lg mt-4'>
                                Connexion
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className='text-purple-400 hover:text-purple-500'
                            >
                                Pas de compte ? S'inscrire
                            </button>
                        </div>
                    )
                    : (
                        <div className='p-10 rounded-xl border-2 border-zinc-600 bg-zinc-900 flex flex-col gap-8'>
                            <h1 className='text-white text-center text-3xl font-semibold'>
                                S'inscrire
                            </h1>
                            <input
                                name='email'
                                type='email'
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })}
                                className='px-4 py-2 rounded-lg'
                                placeholder='Email'
                            />
                            <input
                                name='password'
                                type='password'
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })}
                                className='px-4 py-2 rounded-lg'
                                placeholder='Mot de passe'
                            />
                            <input
                                name='confPassword'
                                type='password'
                                value={formData.confPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confPassword: e.target.value,
                                    })}
                                className='px-4 py-2 rounded-lg'
                                placeholder='Confirmer le mot de passe'
                            />
                            <button className='bg-purple-600 px-4 py-2 rounded-lg mt-4'>
                                S'inscrire
                            </button>
                            <button
                                onClick={() => setIsLogin(true)}
                                className='text-purple-400 hover:text-purple-500'
                            >
                                Déjà un compte ? Se connecter
                            </button>
                        </div>
                    )}
                <button
                    onClick={initiateGoogleLogin}
                    className='flex gap-2 justify-center items-center mt-4 text-purple-400 hover:text-purple-500 border-2 border-purple-600 w-full rounded-xl px-4 py-2 font-bold'
                >
                    Continuer avec Google
                    <LucideChrome />
                </button>
            </div>
        </div>
    );
}

export default App;
