import { createRootRoute, retainSearchParams, Outlet } from '@tanstack/react-router';


function Root() {
  return (
    <Outlet />
  );
}

export const Route = createRootRoute({
  component: Root,
  search: {
    middlewares: [ retainSearchParams(['dataset']) ],
  }
});
