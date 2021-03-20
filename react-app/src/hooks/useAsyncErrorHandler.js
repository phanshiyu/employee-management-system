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

          showToast(`Server dnt like you: ${data.code}`);
          break;
        }
        case NO_RESPONSE_ERROR: {
          showToast('Server dnt give respose leh');
          break;
        }
        default: {
          showToast(
            'Something bad happened, but i dunno what, dont ask me, i rly dunno'
          );
        }
      }
    }
  }, [error]);
};
