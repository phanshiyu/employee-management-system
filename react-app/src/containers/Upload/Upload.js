import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Card, ProgressBar, NonIdealState, Button } from '@blueprintjs/core';
import Dropzone from 'components/Dropzone/Dropzone';

import Typography from 'components/Typography/Typography';
import FileDetailsPreview from 'components/FileDetailsPreview/FileDetailsPreview';
import { showToast } from 'components/Toaster/Toaster';

// services
import { uploadUserCSV, getUserUploads } from 'services/userService';
// hooks
import { useAsync } from 'hooks/useAsync';
import { useAsyncErrorHandler } from 'hooks/useAsyncErrorHandler';
import Table from 'components/Table/Table';
import { usePrevious } from 'hooks/usePrevious';
import { formatDateString } from 'utils/format';

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;

  justify-content: center;
  align-items: center;
`;

const bold = (val) =>
  val === 'processing' ? (
    <SpinnerContainer>
      <ProgressBar />
    </SpinnerContainer>
  ) : (
    <b>{val}</b>
  );

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 16px;
`;

// assume userid = user1
const userID = 'user1';
export const Upload = () => {
  const {
    execute: uploadExecute,
    status: uploadStatus,
    error: uploadError,
  } = useAsync(uploadUserCSV);
  useAsyncErrorHandler(uploadError);

  const {
    execute: getUserUploadsExecute,
    status: getUserUploadsStatus,
    error: getUserUploadsError,
    value: userUploads,
  } = useAsync(getUserUploads);
  useAsyncErrorHandler(getUserUploadsError);

  useEffect(() => {
    getUserUploadsExecute(userID);
  }, [getUserUploadsExecute]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      getUserUploadsExecute(userID);
    }, 5000);
    return () => {
      clearInterval(pollInterval);
    };
  });

  const prevUserUploads = usePrevious(userUploads);

  useEffect(() => {
    if (uploadStatus === 'success') {
      showToast('Everybody calm down! CSV upload was a success!!!', 'success');

      // reset state
      setProgress(0);
      setSelectedFile(null);
      getUserUploadsExecute(userID);
    }
  }, [uploadStatus, getUserUploadsExecute]);

  useEffect(() => {
    if (uploadStatus) {
      getUserUploadsExecute(userID);
    }
  }, [uploadStatus, getUserUploadsExecute]);

  const [selectedFile, setSelectedFile] = useState();
  const [progress, setProgress] = useState(0);
  const handleOnDrop = (files) => {
    setSelectedFile(files[0]);
  };

  const handleOnUploadClick = () => {
    setProgress(0);

    uploadExecute(selectedFile, (prog) => {
      setProgress(prog / 100);
    });
  };

  return (
    <section>
      <Card>
        <Typography variant="h2" $mb={2}>
          Upload CSV
        </Typography>
        <Table
          numRows={prevUserUploads ? prevUserUploads?.length : 3}
          numCols={4}
          headerLabels={['ID', 'Status', 'Updated', 'Created']}
          keys={['Filepath', 'Status', 'DateUpdated', 'DateCreated']}
          transformData={{
            Status: bold,
            DateUpdated: formatDateString,
            DateCreated: formatDateString,
          }}
          items={prevUserUploads}
          loading={getUserUploadsStatus === 'pending' && !prevUserUploads}
          tableProps={{ width: '100%' }}
        />
      </Card>
      <Card>
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
            {uploadStatus === 'pending' ? (
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
                    disabled={uploadStatus === 'pending'}
                    loading={uploadStatus === 'pending'}
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
                    <Button large disabled={uploadStatus === 'pending'}>
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
