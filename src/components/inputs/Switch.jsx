import { Switch as NativeSwitch } from '@headlessui/react';


function Switch({ children, checked, onChange, labelFlip = false, ...rest }) {
  return (
    <div className="inline-flex items-center">
      {labelFlip && children && <div onClick={onChange} className="pr-1 cursor-pointer text-sm">{children}</div>}
      <NativeSwitch
        checked={checked}
        onChange={onChange}
        className="group relative flex h-5 w-9 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
        {...rest}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-3 translate-x-4 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-0 group-data-checked:bg-lime-400"
        />
      </NativeSwitch>
      {!labelFlip && children && <div onClick={onChange} className="pl-1 cursor-pointer text-sm">{children}</div>}
    </div>
  );
}

export default Switch;
