import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Typography from 'components/Typography/Typography';
import Dropzone from 'components/Dropzone/Dropzone';
import { uploadUserCSV } from 'services/userService';
import {
  Card,
  ProgressBar,
  NonIdealState,
  Button,
  Callout,
} from '@blueprintjs/core';
import { useAsync } from 'hooks/useAsync';
import { useAsyncErrorHandler } from 'hooks/useAsyncErrorHandler';
import { showToast } from 'components/Toaster/Toaster';

const FileDetailRoot = styled.div``;

const FileDetailsPreviewRoot = styled.div`
  ul {
    list-style-type: none;
    padding: 0;

    > *:not(:last-child) {
      margin-bottom: 8px;
    }
  }
`;

const FileDetail = ({ label, value }) => (
  <FileDetailRoot>
    <Typography secondaryColor>{label}</Typography>
    <Typography variant="h5">{value}</Typography>
  </FileDetailRoot>
);

const FileDetailsPreview = ({ file }) => {
  const { name, path, size, type } = file;
  return (
    <FileDetailsPreviewRoot>
      <Typography>
        Please confirm yo file details, if not, feel free to pick another one
      </Typography>
      <Callout>
        <ul>
          <li>
            <FileDetail label="Name" value={name} />
          </li>
          <li>
            <FileDetail label="Path" value={path} />
          </li>
          <li>
            <FileDetail label="Size" value={size} />
          </li>
          <li>
            <FileDetail label="Type" value={type} />
          </li>
        </ul>
      </Callout>
    </FileDetailsPreviewRoot>
  );
};

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 8px;
`;

export const Upload = () => {
  const { execute, status, error } = useAsync(uploadUserCSV);
  useAsyncErrorHandler(error);

  const [selectedFile, setSelectedFile] = useState();
  const [progress, setProgress] = useState(0);
  const handleOnDrop = (files) => {
    setSelectedFile(files[0]);
  };

  const handleOnUploadClick = () => {
    execute(selectedFile, (prog) => {
      setProgress(prog / 100);
    });
  };

  useEffect(() => {
    if (status === 'success') {
      showToast('Everybody calm down! CSV upload was a success!!!', 'success');

      // reset state
      setProgress(0);
      setSelectedFile(null);
    }
  }, [status]);

  return (
    <section>
      <Card>
        <Typography variant="h2" $mb={2}>
          Upload CSV
        </Typography>
        {!selectedFile ? (
          <Dropzone
            onDrop={handleOnDrop}
            dropzoneProps={{
              accept: 'text/csv',
              maxFiles: 1,
            }}
          >
            <NonIdealState icon="upload" title="Click or drag me a csv" />
          </Dropzone>
        ) : (
          <>
            {status === 'pending' ? (
              <ProgressBar progress={progress} />
            ) : (
              <>
                <FileDetailsPreview file={selectedFile} />
                <ActionsContainer>
                  <Button
                    onClick={handleOnUploadClick}
                    icon="upload"
                    large
                    intent="primary"
                    disabled={status === 'pending'}
                    loading={status === 'pending'}
                  >
                    Upload
                  </Button>
                  <Dropzone
                    onDrop={handleOnDrop}
                    dropzoneProps={{
                      accept: 'text/csv',
                      maxFiles: 1,
                    }}
                  >
                    <Button icon="upload" large disabled={status === 'pending'}>
                      Choose a different file
                    </Button>
                  </Dropzone>
                </ActionsContainer>
              </>
            )}
          </>
        )}
      </Card>
    </section>
  );
};

export default Upload;
