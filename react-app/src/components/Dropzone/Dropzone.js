import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dropzone({
  onDrop = () => {},
  dropzoneProps = {},
  children,
  className,
}) {
  const handleOnDrop = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleOnDrop,
    ...dropzoneProps,
  });

  return (
    <div {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
}
