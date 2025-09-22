import { Input as NativeInput } from '@headlessui/react';


function Input(props) {
  return <NativeInput type="text" {...props} />;
}

export default Input;
