import React from 'react';

// ui components
import { InputGroup, RangeSlider } from '@blueprintjs/core';
import SearchParameter from 'components/SearchParemeter/SearchParemeter';

import { RangeInputContainer, Root } from './RangeControlGroup.styled';

export default function RangeControlGroup({
  label,
  range,
  rangeSliderProps = {},
  onMinInputChange: handleMinInputChange,
  onMaxInputChange: handleMaxInputChange,
}) {
  return (
    <SearchParameter label={label}>
      <Root>
        <RangeSlider {...rangeSliderProps} />
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
      </Root>
    </SearchParameter>
  );
}
