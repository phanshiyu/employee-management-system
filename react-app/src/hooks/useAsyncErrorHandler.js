import { useEffect } from 'react';
import { showToast } from 'components/Toaster/Toaster';
import {
  NO_RESPONSE_ERROR,
  SERVER_RESPONSE_ERROR,
} from 'constants/asyncErrors';

export const useAsyncErrorHandler = (error) => {
  useEffect(() => {
    if (error) {
      const { type } = error;

      switch (type) {
        case SERVER_RESPONSE_ERROR: {
          const { data } = error;

          showToast(`Server response error code: ${data.code}`);
          break;
        }
        case NO_RESPONSE_ERROR: {
          showToast('Did not manage to receive response from server');
          break;
        }
        default: {
          showToast('Something went wrong :(');
        }
      }
    }
  }, [error]);
};
