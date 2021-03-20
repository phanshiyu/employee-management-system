import styled from 'styled-components';

export const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > * {
    max-width: 1440px;
    width: 100%;
    padding: 16px;
  }
`;
