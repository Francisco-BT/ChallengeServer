import axios from 'axios';

const CancelToken = axios.CancelToken;
export function requestHandler({
  setLoading,
  sessionExpired,
  setErrors,
  onError = () => {},
  apiCall,
}) {
  const source = CancelToken.source();
  let unmounted = false;
  const request = async () => {
    try {
      !unmounted && setLoading(true);
      !unmounted && setErrors({});
      return await apiCall(unmounted, source.token);
    } catch (error) {
      let message = 'Something went wrong, please try again';
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          return sessionExpired();
        }
        if (status === 400) {
          onError('Some fields has invalid values, please try again');
          return setErrors(error.response.data.errors || true);
        }

        if (error.response && error.response.data) {
          message = error.response.data.message;
        }
      }

      onError(message);
      !unmounted && setErrors({ message });
      return false;
    } finally {
      !unmounted && setLoading(false);
    }
  };

  const cleanUp = () => {
    unmounted = true;
    source.cancel();
  };

  return { request, cleanUp };
}
