import * as React from 'react';
import styled from 'styled-components';

const Root = styled.nav`
  height: 88px;

  padding: 16px;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    display: flex;
  }

  button {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;

    background: transparent;

    color: inherit;
    font: inherit;

    line-height: normal;

    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    -webkit-appearance: none;

    outline: none;

    /* Remove excess padding and border in Firefox 4+ */
    &::-moz-focus-inner {
      border: 0;
      padding: 0;
    }

    &:hover {
      cursor: pointer;
    }

    padding: 8px 16px;

    font-size: 1.563rem;
    font-weight: 400;
  }

  display: flex;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 16px 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Navbar = ({ children }) => {
  return (
    <Root>
      <ContentContainer>{children}</ContentContainer>
    </Root>
  );
};

export default Navbar;
