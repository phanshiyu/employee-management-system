import React from 'react';

// ui components
import { HTMLSelect } from '@blueprintjs/core';

import SearchParameter from 'components/SearchParemeter/SearchParemeter';

import { Root } from './SortControl.styled';

export const SortControl = ({
  label,
  sortKey,
  sortDirection,
  sortKeys = [],
  onSortKeyChange: handleSortKeyChange,
  onSortDirectionChange: handleSortDirectionChange,
}) => (
  <SearchParameter label={label}>
    <Root>
      <HTMLSelect value={sortKey} onChange={handleSortKeyChange}>
        {sortKeys.map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </HTMLSelect>
      <HTMLSelect value={sortDirection} onChange={handleSortDirectionChange}>
        <option value="+">Ascending</option>
        <option value="-">Descending</option>
      </HTMLSelect>
    </Root>
  </SearchParameter>
);

export default SortControl;
