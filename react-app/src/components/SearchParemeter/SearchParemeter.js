import React from 'react';

import Typography from 'components/Typography/Typography';

const SearchParameter = ({ label, children }) => (
  <div>
    <Typography tag="h3" variant="h5" $mb={2}>
      {label}
    </Typography>
    {children}
  </div>
);

export default SearchParameter;
