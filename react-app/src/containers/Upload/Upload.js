import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Typography from 'components/Typography/Typography';
import FileDetailsPreview from 'components/FileDetailsPreview/FileDetailsPreview';
import Dropzone from 'components/Dropzone/Dropzone';
import { uploadUserCSV } from 'services/userService';
import { Card, ProgressBar, NonIdealState, Button } from '@blueprintjs/core';
import { useAsync } from 'hooks/useAsync';
import { useAsyncErrorHandler } from 'hooks/useAsyncErrorHandler';
import { showToast } from 'components/Toaster/Toaster';

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 16px;
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
    setProgress(0);

    execute(selectedFile, (prog) => {
      console.log(prog / 100);
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
              <>
                <Typography>
                  {progress < 1 ? '我正在为你上传..' : '破译... 你明白吗?'}{' '}
                </Typography>
                <ProgressBar value={progress} />
              </>
            ) : (
              <>
                <FileDetailsPreview
                  file={selectedFile}
                  descripton="Please confirm yo file details, if not, feel free to pick another one"
                />
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
                    <Button large disabled={status === 'pending'}>
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
