import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';


const defaultOptions = {
  type: 'info',
  duration: 4000,
  dismissible: true,
  position: 'bottom-right'
};

export default function toast(message, options = {}) {
  NotifyX.show({
    ...defaultOptions,
    ...options,
    message
  });
}
