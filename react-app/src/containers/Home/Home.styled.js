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

export const SearchContainer = styled(Card)`
  width: 100%;
  max-width: 350px;

  > *:not(:last-child) {
    margin-bottom: 32px;
  }

  button {
    width: 100%;
  }
`;

export const RangeInputContainer = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 16px;
  > *:not(:last-child) {
    margin-right: 16px;
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

export const SalarySearchContainer = styled.div`
  > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

export const SortContentContainer = styled.div`
  display: flex;
  > *:not(:last-child) {
    margin-right: 8px;
  }
`;
