import React from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import WithMargin from 'components/WithMargin/WithMargin';

const typeScale = {
  h1: { fontSize: '3.052rem', lineHeight: '1.3' },
  h2: { fontSize: '2.441rem', lineHeight: '1.3' },
  h3: { fontSize: '1.953rem', lineHeight: '1.3' },
  h4: { fontSize: '1.563rem', lineHeight: '1.3' },
  h5: { fontSize: '1.25rem', lineHeight: '1.3' },
};

const getStyle = (variant) => {
  if (!typeScale[variant]) {
    return '';
  }

  return `font-size: ${typeScale[variant].fontSize}; line-height: ${typeScale[variant].lineHeight};`;
};

const Typography = styled(
  ({ tag: Tag = 'p', secondaryColor, children, ...props }) => (
    <Tag {...props}>{children}</Tag>
  ),
)`
  ${({ variant, cursive, secondaryColor }) => [
    getStyle(variant),
    cursive
      ? `font-family: 'Bad Script', cursive;
  `
      : '',
    secondaryColor ? 'color: #457b9d;' : '',
  ]}
`;

Typography.propTypes = {
  children: propTypes.any,
  tag: propTypes.oneOf(['p', 'h1', 'h2', 'h3']),
};

export default WithMargin(Typography);
