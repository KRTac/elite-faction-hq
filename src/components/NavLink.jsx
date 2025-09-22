import { Link } from '@tanstack/react-router';


function NavLink({ children, to, matchExact, ...rest }) {
  return (
    <Link
      to={to}
      activeOptions={{
        exact: !!matchExact
      }}
      activeProps={{ 'data-active': true }}
      {...rest}
    >
      {children}
    </Link>
  );
}

export default NavLink;
