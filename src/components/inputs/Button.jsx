import { Button as NativeButton } from '@headlessui/react';


function Button({ children, isActive, ...rest }) {
  if (isActive) {
    rest = { ...rest, 'data-active': true };
  }

  return (
    <NativeButton className="rounded bg-lime-800 px-3 py-1 text-sm text-white data-hover:bg-lime-700 data-active:bg-amber-900 data-active:data-hover:bg-amber-700" {...rest}>
      {children}
    </NativeButton>
  );
}

export default Button;
