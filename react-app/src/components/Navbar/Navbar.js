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

  a {
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

const Navbar = ({ children }) => (
  <Root>
    <ContentContainer>{children}</ContentContainer>
  </Root>
);

export default Navbar;
