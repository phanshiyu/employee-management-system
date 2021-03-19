import styled from 'styled-components';

export const Root = styled.section``;

export const ContentContainer = styled.section`
  width: 100%;
  display: flex;
  align-items: flex-start;

  justify-content: space-between;
`;

export const FilterContainer = styled.div`
  background-color: #272635;
  border-radius: 8px;
  color: #e8e9f3;
  width: 100%;
  max-width: 300px;

  padding: 32px;

  > *:not(:last-child) {
    margin-bottom: 32px;
  }

  button {
    width: 100%;
  }

  .bp3-divider {
    border-color: white;
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

export const ResultsContainer = styled.div`
  width: 100%;
  margin-left: 24px;
  table {
    width: 100%;
  }
`;

export const SalaryFilterContainer = styled.div`
  > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;
