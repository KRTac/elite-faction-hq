import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import IconButton from './inputs/IconButton';


function useDebouncedProp(prop, debounce = 500) {
  const isMounted = useRef(false);
  const [ storedProp, setStoredProp ] = useState(prop);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (debounce <= 0) {
      setStoredProp(prop);
    } else {
      const timeout = setTimeout(() => {
        if (isMounted.current) {
          setStoredProp(prop);
        }
      }, debounce);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [ debounce, prop ]);

  return storedProp;
}

function Modal({ isOpen, onClose, title, children }) {
  const storedTitle = useDebouncedProp(title, isOpen ? 0 : 500);
  const storedChildren = useDebouncedProp(children, isOpen ? 0 : 500);

  if (!isOpen) {
    title = storedTitle;
    children = storedChildren;
  }

  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto dark:bg-white/5 backdrop-blur-3xl">
        <div className="flex min-h-full items-center justify-center p-3">
          <DialogPanel
            transition
            className="w-full max-w-5xl rounded-xl dark:bg-black/60 py-4 px-6 backdrop-blur-3xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 relative"
          >
            {title && (
              <DialogTitle as="p" className="text-xl/5 mb-4 text-center font-medium dark:text-white">
                {title}
              </DialogTitle>
            )}
            {children}
            <div className="absolute top-1.5 right-1.5 inline-flex">
              <IconButton
                onClick={onClose}
                title="Close"
                as={XMarkIcon}
                iconClassName="size-7"
              />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default Modal;
