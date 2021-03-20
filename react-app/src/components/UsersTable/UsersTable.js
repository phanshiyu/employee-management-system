import React from 'react';

// ui components
import { Button, NonIdealState } from '@blueprintjs/core';

import Table from 'components/Table/Table';

import { Root, PaginationNavigationRoot } from './UsersTable.styled';

export default function UserTable({
  items,
  numCols,
  numRows,
  headerLabels,
  keys,
  paginationNavigation,
  loading,
  showEmptyState,
}) {
  return (
    <Root>
      {showEmptyState ? (
        <NonIdealState
          icon={'search'}
          title="No results :("
          description={'Upload a new CSV file or play around with the filters!'}
        />
      ) : (
        <div>
          <Table
            numCols={numCols}
            numRows={numRows}
            items={items}
            headerLabels={headerLabels}
            keys={keys}
            loading={loading}
          />
          {paginationNavigation}
        </div>
      )}
    </Root>
  );
}

export const PaginationNavigation = ({
  page,
  totalPage,
  disabledPrev = false,
  disabledNext = false,
  onPrevClick: handlePrevClick,
  onNextClick: handleNextClick,
}) => (
  <PaginationNavigationRoot>
    <Button disabled={disabledPrev} onClick={handlePrevClick}>
      Previous
    </Button>
    {page} / {totalPage ? totalPage : ''}
    <Button disabled={disabledNext} onClick={handleNextClick}>
      Next
    </Button>
  </PaginationNavigationRoot>
);
