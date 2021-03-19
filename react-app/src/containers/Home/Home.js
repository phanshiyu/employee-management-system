import React, { useEffect, useState } from 'react';
import { getUsers, uploadUserCSV } from 'services/userService';

// ui components
import {
  Button,
  InputGroup,
  RangeSlider,
  Icon,
  NonIdealState,
  HTMLSelect,
} from '@blueprintjs/core';

import Table from 'components/Table/Table';
import Typography from 'components/Typography/Typography';
import Dropzone from 'components/Dropzone/Dropzone';

import {
  Root,
  FilterContainer,
  ContentContainer,
  RangeInputContainer,
  ResultsContainer,
  SalaryFilterContainer,
} from './Home.styled';

// hooks
import { useAsync } from 'hooks/useAsync';
import { useAsyncErrorHandler } from 'hooks/useAsyncErrorHandler';
import { showToast } from 'components/Toaster/Toaster';

const maxSalary = 300000;
export default function Home() {
  const { execute, status, value, error } = useAsync(getUsers);
  useAsyncErrorHandler(error);

  const [limit, setLimit] = useState(30);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [range, setRange] = useState([0, maxSalary]);
  const [salaryRange, setSalaryRange] = useState([]);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState('+');
  const [sortParam, setSortParam] = useState();

  useEffect(() => {
    execute(limit, offset, salaryRange[0], salaryRange[1], sortParam);
  }, [limit, offset, salaryRange, sortParam]);

  useEffect(() => {
    if (value) {
      const { limit, offset } = value;
      const page = Math.floor(offset / limit) + 1;
      setPage(page);
    }
  }, [value]);

  const handlePrevClick = () => {
    setOffset((val) => val - limit);
  };

  const handleNextClick = () => {
    setOffset((val) => val + limit);
  };

  // derived values
  const totalPage = value ? Math.floor(value.total / limit) : '';

  const handleRangeValueChange = (newRange) => {
    setRange(newRange);
  };

  const handleMinInputChange = (event) => {
    let lowerRange = event.target.value;
    if (isNaN(lowerRange)) {
      return;
    }

    if (!lowerRange) {
      lowerRange = 0;
    }
    setRange((prevRange) => [parseInt(lowerRange), prevRange[1]]);
  };

  const handleMaxInputChange = (event) => {
    if (isNaN(event.target.value)) {
      return;
    }
    setRange((prevRange) => [prevRange[0], parseInt(event.target.value)]);
  };

  const handleOnDrop = (files) => {
    uploadUserCSV(files[0]);
  };

  const handleSearchClick = () => {
    setSalaryRange(range);
    setOffset(0);
    setSortParam(sortDirection + sortKey);
  };

  return (
    <Root>
      <Typography tag="h1">Employees</Typography>

      <ContentContainer>
        <FilterContainer>
          <SalaryFilterContainer>
            <Typography tag="h3">Salary range</Typography>
            <RangeSlider
              min={0}
              max={maxSalary}
              stepSize={1}
              labelStepSize={maxSalary / 4}
              onChange={handleRangeValueChange}
              value={range}
            />
            <RangeInputContainer>
              <InputGroup
                type="number"
                value={range[0]}
                onChange={handleMinInputChange}
                placeholder="Min"
              />
              <InputGroup
                type="number"
                value={range[1]}
                onChange={handleMaxInputChange}
                placeholder="Max"
              />
            </RangeInputContainer>
          </SalaryFilterContainer>
          <SalaryFilterContainer>
            <Typography tag="h3">Sort</Typography>
            <HTMLSelect
              value={sortKey}
              onChange={(event) => {
                setSortKey(event.target.value);
              }}
            >
              {['id', 'login', 'name', 'salary'].map((sortKey) => (
                <option key={sortKey} value={sortKey}>
                  {sortKey}
                </option>
              ))}
            </HTMLSelect>
            <div>
              <HTMLSelect
                value={sortDirection}
                onChange={(event) => {
                  setSortDirection(event.target.value);
                }}
              >
                <option value="+">Ascending</option>
                <option value="-">Descending</option>
              </HTMLSelect>
            </div>
          </SalaryFilterContainer>
          <Button
            onClick={handleSearchClick}
            text="Search"
            disabled={status === 'pending'}
            loading={status === 'pending'}
          />
        </FilterContainer>
        <ResultsContainer>
          <Dropzone
            onDrop={handleOnDrop}
            dropzoneProps={{
              accept: 'text/csv',
              maxFiles: 1,
            }}
          >
            <Button icon={<Icon icon="document" />}>Upload CSV</Button>
          </Dropzone>
          {!value?.total && status === 'success' ? (
            <NonIdealState
              icon={'search'}
              title="No results :("
              description={
                'Upload a new CSV file or play around with the filters!'
              }
            />
          ) : (
            <div>
              <Table
                numCols={4}
                numRows={limit}
                data={value}
                headerLabels={['ID', 'Login', 'Name', 'Salary']}
                keys={['id', 'login', 'name', 'salary']}
                loading={status !== 'success'}
              />
              <div>
                <Button
                  disabled={page === 1 || status === 'pending'}
                  onClick={handlePrevClick}
                >
                  Previous
                </Button>
                {page} / {totalPage ? totalPage : ''}
                <Button
                  disabled={page === totalPage || status === 'pending'}
                  onClick={handleNextClick}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </ResultsContainer>
      </ContentContainer>
    </Root>
  );
}
