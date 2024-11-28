import React from 'react';
import { useNavigate } from 'react-router-dom';

export const GoogleCallback = () => {
    const [error, setError] = React.useState<string>();
    const navigate = useNavigate();

    const exchangeCode = async (code: string, verifier: string) => {
        console.log(code, verifier);
        try {
            const result = await fetch(
                'http://localhost:3000/auth/oauth/google',
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        code: code,
                        verifier: verifier,
                    }),
                },
            );
            if (result.status > 399) {
                throw new Error('impossible to log in');
            }
            const data = await result.json();

            console.log(data);
            if (data.user) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('sessId', data.sessId);
                sessionStorage.setItem('sessToken', data.sessToken);
                navigate('/user');
                console.log(data);
                return;
            }
            throw new Error();
        } catch (err) {
            console.log(err);
            setError('Whops');
            // navigate('/');
        }
    };

    const handleExchange = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!code) return console.log('errror');

        const verifier = sessionStorage.getItem('codeVerifier');
        if (!verifier) return console.log('errooor');

        exchangeCode(code, verifier);
    };

    React.useEffect(() => {
        handleExchange();
    }, [navigate]);

    return (
        <div className='w-full h-dvh flex items-center justify-center'>
            {error
                ? (
                    <div className='flex gap-2 flex-col'>
                        <h1 className='text-2xl font-bold'>{error}</h1>
                        <button onClick={() => navigate('/')}>Go back</button>
                    </div>
                )
                : (
                    <div className='size-20 rounded-full border-[6px] border-zinc-400 animate-spin' />
                )}
        </div>
    );
};
