import React, { useState, useEffect, useCallback } from 'react';

export const useAsync = (asyncFunction, immediate = false) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    (...params) => {
      setStatus('pending');
      setValue(null);
      setError(null);

      return asyncFunction(...params)
        .then((response) => {
          setValue(response);
          setStatus('success');
        })
        .catch((error) => {
          setError(error);
          setStatus('error');
        });
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};
