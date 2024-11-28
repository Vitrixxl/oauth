import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
    <div className='h-dvh w-full flex items-center justify-center gap-8'>
        <RouterProvider router={router}></RouterProvider>
    </div>,
);
