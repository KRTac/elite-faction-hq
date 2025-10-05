import { Button as NativeButton } from '@headlessui/react';


function Button({ children, alt, smaller = false, ...rest }) {
  return (
    <NativeButton
      className={[
        'rounded py-1',
        smaller
          ? 'text-sm px-3'
          : 'text-base px-4',
        'cursor-default no-underline transition duration-200',
        'dark:data-disabled:opacity-50',
        'dark:data-active:data-hover:text-neutral-300',
        alt
          ? 'dark:text-neutral-300 dark:data-hover:text-neutral-200'
          : 'dark:text-neutral-100',
        alt
          ? 'dark:bg-stone-800 dark:data-hover:bg-stone-700 dark:data-active:data-hover:bg-stone-900'
          : 'dark:bg-lime-800 dark:data-hover:bg-lime-700 dark:data-active:data-hover:bg-lime-900'
      ].join(' ')}
      {...rest}
    >
      {children}
    </NativeButton>
  );
}

export default Button;
