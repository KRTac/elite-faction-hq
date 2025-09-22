import { createRootRoute, Outlet } from '@tanstack/react-router';


function App() {
  return (
    <Outlet />
  );
}

export const Route = createRootRoute({
  component: App
});
