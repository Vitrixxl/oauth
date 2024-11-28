import React from 'react';
import { getAllUserInfo } from '../api';

export const AdminPage = () => {
    const [users, setUsers] = React.useState<any[]>();

    const fetch = async () => {
        const users = await getAllUserInfo();
        setUsers(users);
    };
    React.useLayoutEffect(() => {
        fetch();
    }, []);
    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-4xl font-bold'>Admin Page</h1>
            {users && users.map((user) => <p>{user.email}</p>)}
        </div>
    );
};
