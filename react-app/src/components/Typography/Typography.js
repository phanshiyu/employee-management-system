import React from 'react';
import propTypes from 'prop-types';

export default function Typography({ tag: Tag = 'p', children }) {
  return <Tag>{children}</Tag>;
}

Typography.propTypes = {
  children: propTypes.any,
  tag: propTypes.oneOf(['p', 'h1', 'h2', 'h3']),
};
