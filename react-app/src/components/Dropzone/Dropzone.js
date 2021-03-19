import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dropzone({
  onDrop = () => {},
  dropzoneProps = {},
  children,
}) {
  const handleOnDrop = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleOnDrop,
    ...dropzoneProps,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
}
