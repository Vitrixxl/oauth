import { Link } from 'react-router-dom';

export const HomePage = () => {
    const logged = sessionStorage.getItem('sessId') &&
        sessionStorage.getItem('sessToken');
    return (
        <div className='flex flex-col gap-4'>
            {!logged
                ? (
                    <div className='text-2xl font-bold flex flex-col gap-8 items-center'>
                        You need to be logged in brother
                        <Link
                            to='/login'
                            className='px-4 py-1 bg-gradient-to-br from-purple-700 to-purple-600 rounded-xl w-fit'
                        >
                            Go
                        </Link>
                    </div>
                )
                : (
                    <Link to={'/users/:id'}>
                        Go to your account
                    </Link>
                )}
        </div>
    );
};
