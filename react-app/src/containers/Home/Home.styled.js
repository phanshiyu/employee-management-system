import styled from 'styled-components';
import { Card } from '@blueprintjs/core';
export const Root = styled.section`
  height: 100%;
`;

export const ContentContainer = styled.div`
  width: 100%;
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  height: 100%;
`;

export const LeftContainer = styled.div`
  position: sticky;
  top: 0;

  width: 100%;
  max-width: 350px;

  > *:not(:last-child) {
    margin-bottom: 24px;
  }
`;

export const SearchContainer = styled(Card)`
  width: 100%;

  > *:not(:last-child) {
    margin-bottom: 32px;
  }
`;

export const ResultsContainer = styled(Card)`
  width: 100%;
  margin-left: 24px;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const FormContainer = styled(Card)`
  max-width: 500px;
  width: 100%;
`;

export const ControlsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
