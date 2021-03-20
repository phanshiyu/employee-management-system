import React, { useEffect, useState } from 'react';
import { getUsers } from 'services/userService';

// ui components
import { Button, Divider } from '@blueprintjs/core';

import RangeControlGroup from 'components/RangeControlGroup/RangeControlGroup';
import SortControl from 'components/SortControl/SortControl';
import UsersTable, {
  PaginationNavigation,
} from 'components/UsersTable/UsersTable';

import {
  Root,
  SearchContainer,
  ContentContainer,
  ResultsContainer,
} from './Home.styled';

// hooks
import { useAsync } from 'hooks/useAsync';
import { useAsyncErrorHandler } from 'hooks/useAsyncErrorHandler';

const maxSalary = 100000;
export default function Home() {
  const { execute, status, value, error } = useAsync(getUsers);
  useAsyncErrorHandler(error);

  const [limit] = useState(30);
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

  const totalPage = value ? Math.floor(value.total / limit) + 1 : '';

  const handleRangeValueChange = (newRange) => {
    setRange(newRange);
  };

  const handleMinInputChange = (event) => {
    let lowerRange = event.target.value;
    if (lowerRange.length > 0 && isNaN(lowerRange)) {
      return;
    }

    setRange((prevRange) => [parseInt(lowerRange), prevRange[1]]);
  };

  const handleMaxInputChange = (event) => {
    const upperRange = event.target.value;
    if (upperRange.length > 0 && isNaN(upperRange)) {
      return;
    }
    setRange((prevRange) => [prevRange[0], parseInt(event.target.value)]);
  };

  const handleSearchClick = () => {
    setSalaryRange(range);
    setOffset(0);
    setSortParam(sortDirection + sortKey);
  };

  return (
    <Root>
      <ContentContainer>
        <SearchContainer>
          <RangeControlGroup
            label="Salary range"
            range={range}
            onMinInputChange={handleMinInputChange}
            onMaxInputChange={handleMaxInputChange}
            rangeSliderProps={{
              min: 0,
              max: maxSalary,
              stepSize: 1,
              labelStepSize: maxSalary / 4,
              onChange: handleRangeValueChange,
              value: range,
            }}
          />
          <Divider />
          <SortControl
            label="Sort by"
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortKeys={['id', 'login', 'name', 'salary']}
            onSortKeyChange={(event) => {
              setSortKey(event.target.value);
            }}
            onSortDirectionChange={(event) => {
              setSortDirection(event.target.value);
            }}
          />
          <Button
            icon="search"
            intent="primary"
            large
            onClick={handleSearchClick}
            text="Search"
            disabled={status === 'pending'}
            loading={status === 'pending'}
          />
        </SearchContainer>
        <ResultsContainer>
          <UsersTable
            numCols={4}
            numRows={limit}
            showEmptyState={!value?.total && status === 'success'}
            headerLabels={['ID', 'Login', 'Name', 'Salary']}
            keys={['id', 'login', 'name', 'salary']}
            loading={status !== 'success'}
            items={value?.items}
            paginationNavigation={
              <PaginationNavigation
                page={page}
                totalPage={totalPage}
                disabledPrev={page === 1 || status === 'pending'}
                disabledNext={page === totalPage || status === 'pending'}
                onPrevClick={handlePrevClick}
                onNextClick={handleNextClick}
              />
            }
          />
        </ResultsContainer>
      </ContentContainer>
    </Root>
  );
}
