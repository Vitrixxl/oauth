import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyInfo } from '../api';

export const UserPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState();

    const fetchData = async () => {
        const user = await getMyInfo();
        if (!user) {
            navigate('/login');
        }
        setUser(user);
    };
    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='p-4 border-4 border-zinc-400 rounded-2xl hover:scale-105 transition-all flex flex-col'>
            {user
                ? Object.entries(user).map(([k, v]) => (
                    <p className=' flex gap-2 items-center'>
                        <span className='font-bold text-xl text-purple-400'>
                            {k} :
                        </span>
                        <span className='text-lg font-semibold'>
                            {v as string || 'Not provided'}
                        </span>
                    </p>
                ))
                : (
                    <div className='size-20 rounded-full border-transparent border-t-zinc-400 border-[6px] animate-spin' />
                )}
        </div>
    );
};
