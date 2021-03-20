import styled from 'styled-components';

export const RangeInputContainer = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 16px;
  > *:not(:last-child) {
    margin-right: 16px;
  }
`;

export const Root = styled.div`
  > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;
