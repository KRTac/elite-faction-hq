import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

import { routeTree } from './routeTree.gen';


const router = createRouter({
  routeTree
});
console.log(`BASE_PATH: ${import.meta.env.BASE_URL}`);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
