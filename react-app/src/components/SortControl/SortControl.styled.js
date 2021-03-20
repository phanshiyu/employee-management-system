import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  > *:not(:last-child) {
    margin-right: 8px;
  }
`;
