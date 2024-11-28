import { createBrowserRouter } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GoogleCallback } from './pages/GoogleCallback';
import { UserPage } from './pages/UserPage';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';

export const router = createBrowserRouter([
    {
        path: '',
        element: <HomePage />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/callback/google',
        element: <GoogleCallback />,
    },
    {
        path: '/user',
        element: <UserPage />,
    },
    {
        path: '/admin',
        element: <AdminPage />,
    },
]);
