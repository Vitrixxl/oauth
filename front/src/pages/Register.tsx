import React from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeGoogleAuth } from '../api';
import { LucideChrome } from 'lucide-react';

export const Register = () => {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        confPassword: '',
    });

    const navigate = useNavigate();
    return (
        <div className='flex gap-8 flex-col'>
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
                    onClick={() => navigate('/login')}
                    className='text-purple-400 hover:text-purple-500'
                >
                    Déjà un compte ? Se connecter
                </button>
            </div>
            <button
                onClick={initializeGoogleAuth}
                className='flex gap-2 justify-center items-center mt-4 text-purple-400 hover:text-purple-500 border-2 border-purple-600 w-full rounded-xl px-4 py-2 font-bold'
            >
                Continuer avec Google
                <LucideChrome />
            </button>
        </div>
    );
};
