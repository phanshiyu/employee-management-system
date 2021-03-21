import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createUser, getUsers } from 'services/userService';

// ui components
import { Button, Card, Divider, Overlay } from '@blueprintjs/core';

import RangeControlGroup from 'components/RangeControlGroup/RangeControlGroup';
import SortControl from 'components/SortControl/SortControl';
import UsersTable, {
  PaginationNavigation,
} from 'components/UsersTable/UsersTable';

import {
  Root,
  LeftContainer,
  SearchContainer,
  ContentContainer,
  ResultsContainer,
} from './Home.styled';

// hooks
import { useAsync } from 'hooks/useAsync';
import { useAsyncErrorHandler } from 'hooks/useAsyncErrorHandler';
import UserForm from 'components/UserForm/UserForm';
import { showToast } from 'components/Toaster/Toaster';
import { formatSGD } from 'utils/format';

const FormContainer = styled(Card)`
  max-width: 500px;
  width: 100%;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);
`;

const maxSalary = 100000;
export default function Home() {
  // get users api
  const {
    execute: getUsersExecute,
    status: getUsersStatus,
    value: getUsersResponse,
    error: getUsersError,
  } = useAsync(getUsers);
  useAsyncErrorHandler(getUsersError);

  // create user api
  const {
    execute: createUserExecute,
    status: createUserStatus,
    value: createUserResponse,
    error: createUserError,
  } = useAsync(createUser);
  useAsyncErrorHandler(createUserError);

  const [limit] = useState(30);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [range, setRange] = useState([0, maxSalary]);
  const [salaryRange, setSalaryRange] = useState([]);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState('+');
  const [sortParam, setSortParam] = useState();
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    getUsersExecute(limit, offset, salaryRange[0], salaryRange[1], sortParam);
  }, [limit, offset, salaryRange, sortParam]);

  useEffect(() => {
    if (getUsersResponse) {
      const { limit, offset } = getUsersResponse;
      const page = Math.floor(offset / limit) + 1;
      setPage(page);
    }
  }, [getUsersResponse]);

  useEffect(() => {
    if (createUserStatus === 'success') {
      setFormOpen(false);
      showToast(`userId: ${createUserResponse?.id} has been added`, 'success');
      getUsersExecute(limit, offset, salaryRange[0], salaryRange[1], sortParam);
    }
  }, [createUserStatus]);

  const handlePrevClick = () => {
    setOffset((val) => val - limit);
  };

  const handleNextClick = () => {
    setOffset((val) => val + limit);
  };

  const totalPage = getUsersResponse
    ? Math.floor(getUsersResponse.total / limit) + 1
    : '';

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

  const handleCreateUser = (user) => {
    user.salary = parseFloat(user.salary);
    createUserExecute(user);
  };

  return (
    <>
      <Root>
        <ContentContainer>
          <LeftContainer>
            <Button
              fill
              icon="add"
              intent="primary"
              large
              onClick={() => setFormOpen(true)}
              text="Create"
              disabled={getUsersStatus === 'pending'}
              loading={getUsersStatus === 'pending'}
            />
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
                fill
                icon="search"
                intent="primary"
                large
                onClick={handleSearchClick}
                text="Search"
                disabled={getUsersStatus === 'pending'}
                loading={getUsersStatus === 'pending'}
              />
            </SearchContainer>
          </LeftContainer>
          <ResultsContainer>
            <UsersTable
              numCols={4}
              numRows={limit}
              showEmptyState={
                !getUsersResponse?.total && getUsersStatus === 'success'
              }
              headerLabels={['ID', 'Login', 'Name', 'Salary']}
              keys={['id', 'login', 'name', 'salary']}
              loading={getUsersStatus !== 'success'}
              items={getUsersResponse?.items}
              transformData={{
                salary: formatSGD,
              }}
              paginationNavigation={
                <PaginationNavigation
                  page={page}
                  totalPage={totalPage}
                  disabledPrev={page === 1 || getUsersStatus === 'pending'}
                  disabledNext={
                    page === totalPage || getUsersStatus === 'pending'
                  }
                  onPrevClick={handlePrevClick}
                  onNextClick={handleNextClick}
                />
              }
            />
          </ResultsContainer>
        </ContentContainer>
      </Root>
      <Overlay
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
        }}
      >
        <FormContainer>
          <UserForm
            onData={handleCreateUser}
            onCancelClick={() => {
              setFormOpen(false);
            }}
            submitButtonProps={{
              loading: createUserStatus === 'pending',
              disabled: createUserStatus === 'pending',
            }}
            cancelButtonProps={{
              disabled: createUserStatus === 'pending',
            }}
          />
        </FormContainer>
      </Overlay>
    </>
  );
}
