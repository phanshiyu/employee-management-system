import React, { useEffect, useState } from 'react';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from 'services/userService';

// ui components
import { Button, Divider, ButtonGroup, Dialog, Card } from '@blueprintjs/core';

import RangeControlGroup from 'components/RangeControlGroup/RangeControlGroup';
import SortControl from 'components/SortControl/SortControl';
import UsersTable, {
  PaginationNavigation,
} from 'components/UsersTable/UsersTable';

// hooks
import { useAsync } from 'hooks/useAsync';
import { useAsyncErrorHandler } from 'hooks/useAsyncErrorHandler';
import UserForm from 'components/UserForm/UserForm';
import { showToast } from 'components/Toaster/Toaster';
import { formatSGD } from 'utils/format';

import Typography from 'components/Typography/Typography';
import {
  Root,
  LeftContainer,
  SearchContainer,
  ContentContainer,
  ResultsContainer,
  FormContainer,
  ControlsContainer,
} from './Home.styled';

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

  // update user api
  const {
    execute: updateUserExecute,
    status: updateUserStatus,
    value: updateUserResponse,
    error: updateUserError,
  } = useAsync(updateUser);
  useAsyncErrorHandler(updateUserError);

  // delete user api
  const {
    execute: deleteUserExecute,
    status: deleteUserStatus,
    value: deleteUserResponse,
    error: deleteUserError,
  } = useAsync(deleteUser);
  useAsyncErrorHandler(deleteUserError);

  const [limit] = useState(30);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [range, setRange] = useState([0, maxSalary]);
  const [salaryRange, setSalaryRange] = useState([]);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState('+');
  const [sortParam, setSortParam] = useState();

  // dialog states
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userIDtoDelete, setUserIDtoDelete] = useState(null);

  useEffect(() => {
    getUsersExecute(limit, offset, salaryRange[0], salaryRange[1], sortParam);
  }, [limit, offset, salaryRange, sortParam, getUsersExecute]);

  useEffect(() => {
    if (getUsersResponse) {
      const newPage =
        Math.floor(getUsersResponse.offset / getUsersResponse.limit) + 1;
      setPage(newPage);
    }
  }, [getUsersResponse]);

  useEffect(() => {
    if (createUserStatus === 'success') {
      setCreateFormOpen(false);
      showToast(`userId: ${createUserResponse?.id} has been added`, 'success');
      getUsersExecute(limit, offset, salaryRange[0], salaryRange[1], sortParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUserStatus, getUsersExecute]);

  useEffect(() => {
    if (updateUserStatus === 'success') {
      setUserToEdit(null);
      showToast(
        `userId: ${updateUserResponse?.id} has been updated`,
        'success',
      );
      getUsersExecute(limit, offset, salaryRange[0], salaryRange[1], sortParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserStatus, getUsersExecute]);

  useEffect(() => {
    if (deleteUserStatus === 'success') {
      setUserIDtoDelete(null);
      showToast(
        `userId: ${deleteUserResponse?.id} has been deleted`,
        'success',
      );
      getUsersExecute(limit, offset, salaryRange[0], salaryRange[1], sortParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteUserStatus, getUsersExecute]);

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
    const lowerRange = event.target.value;
    if (lowerRange.length > 0 && Number.isNaN(lowerRange)) {
      return;
    }

    setRange((prevRange) => [parseInt(lowerRange, 10), prevRange[1]]);
  };

  const handleMaxInputChange = (event) => {
    const upperRange = event.target.value;
    if (upperRange.length > 0 && Number.isNaN(upperRange)) {
      return;
    }
    setRange((prevRange) => [prevRange[0], parseInt(event.target.value, 10)]);
  };

  const handleSearchClick = () => {
    setSalaryRange(range);
    setOffset(0);
    setSortParam(sortDirection + sortKey);
  };

  const handleCreateUser = (user) => {
    createUserExecute({
      ...user,
      salary: parseFloat(user.salary),
    });
  };

  const handleDeleteUser = (userID) => {
    deleteUserExecute(userID);
  };

  const handleEditUser = (user) => {
    updateUserExecute({
      ...user,
      salary: parseFloat(user.salary),
    });
  };

  const handleEditClick = (rowIndex) => () => {
    setUserToEdit(getUsersResponse?.items[rowIndex]);
  };

  const handleDeleteClick = (rowIndex) => () => {
    setUserIDtoDelete(getUsersResponse?.items[rowIndex]?.id);
  };

  function renderItemControls(rowIndex) {
    return (
      <ControlsContainer>
        <ButtonGroup>
          <Button
            onClick={handleEditClick(rowIndex)}
            icon="edit"
            large
          ></Button>
          <Button
            onClick={handleDeleteClick(rowIndex)}
            icon="trash"
            large
            intent="danger"
          />
        </ButtonGroup>
      </ControlsContainer>
    );
  }

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
              onClick={() => setCreateFormOpen(true)}
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
              numCols={5}
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
              overwriteColRenderIntoCell={{
                4: renderItemControls,
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
      <Dialog
        icon="add"
        title="Create"
        isOpen={createFormOpen}
        onClose={() => {
          setCreateFormOpen(false);
        }}
      >
        <FormContainer>
          <UserForm
            onData={handleCreateUser}
            onCancelClick={() => {
              setCreateFormOpen(false);
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
      </Dialog>
      <Dialog
        icon="edit"
        title="Update"
        isOpen={userToEdit !== null}
        onClose={() => {
          setUserToEdit(null);
        }}
      >
        <FormContainer>
          <UserForm
            onData={handleEditUser}
            defaultValues={userToEdit}
            onCancelClick={() => {
              setUserToEdit(null);
            }}
            submitButtonProps={{
              text: 'Update',
              icon: 'edit',
              loading: updateUserStatus === 'pending',
              disabled: updateUserStatus === 'pending',
            }}
            cancelButtonProps={{
              disabled: updateUserStatus === 'pending',
            }}
            disabledFields={{
              id: true,
            }}
          />
        </FormContainer>
      </Dialog>
      <Dialog
        isOpen={userIDtoDelete !== null}
        icon="info-sign"
        onClose={() => setUserIDtoDelete(null)}
        title="Delete confirmation"
      >
        <Card>
          <Typography>
            Ya about to delete user with ID: <b>{userIDtoDelete}</b>
          </Typography>
        </Card>
        <ButtonGroup fill>
          <Button
            intent="danger"
            large
            onClick={() => handleDeleteUser(userIDtoDelete)}
            loading={deleteUserStatus === 'pending'}
            disabled={deleteUserStatus === 'pending'}
          >
            Confirm
          </Button>
          <Button
            onClick={() => setUserIDtoDelete(null)}
            large
            disabled={deleteUserStatus === 'pending'}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Dialog>
    </>
  );
}
