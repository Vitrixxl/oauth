import React from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeGoogleAuth } from '../api';
import { LucideChrome } from 'lucide-react';

export const Login = () => {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    return (
        <div>
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
                    onClick={() => navigate('/register')}
                    className='text-purple-400 hover:text-purple-500'
                >
                    Pas de compte ? S'inscrire
                </button>
            </div>
            <div className='group'>
                <button
                    onClick={initializeGoogleAuth}
                    className='flex gap-2 justify-center items-center mt-4 text-purple-400 hover:text-purple-500 border-2 border-purple-600 w-full rounded-xl px-4 py-2 font-bold group-hover:rotate-[1080deg]  transition-all duration-[2s]'
                >
                    Continuer avec Google
                    <LucideChrome />
                </button>
            </div>
        </div>
    );
};
