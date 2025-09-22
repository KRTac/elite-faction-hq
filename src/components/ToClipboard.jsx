import { ClipboardDocumentIcon } from '@heroicons/react/16/solid';
import toast from '../notifyx.js';


function ToClipboard({ text, ...props }) {
  return (
    <ClipboardDocumentIcon
      className="size-4 dark:fill-white/40 dark:hover:fill-white cursor-pointer transition"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast(`${text} copied`, { duration: 2000 });
      }}
      {...props}
    />
  );
}

export default ToClipboard;
