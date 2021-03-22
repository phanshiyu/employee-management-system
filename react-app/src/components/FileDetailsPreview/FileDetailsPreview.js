import React from 'react';
import styled from 'styled-components';
import { Callout } from '@blueprintjs/core';

import Typography from 'components/Typography/Typography';

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

const FileDetailsPreview = ({ descripton, file }) => {
  const { name, path, size, type } = file;
  return (
    <FileDetailsPreviewRoot>
      <Typography $mb={1}>{descripton}</Typography>
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

export default FileDetailsPreview;
