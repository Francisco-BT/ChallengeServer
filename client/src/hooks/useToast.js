import { toast } from 'react-toastify';

export function useToast() {
  const customToast = (
    message,
    options = { type: 'default', theme: 'light' }
  ) => toast(message, options);

  const errorToast = (message, options = {}) => toast.error(message, options);
  const successToast = (message, options = {}) =>
    toast.success(message, options);
  return {
    customToast,
    errorToast,
    successToast,
  };
}
