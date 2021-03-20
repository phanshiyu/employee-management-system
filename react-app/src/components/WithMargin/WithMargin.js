import styled from 'styled-components';

const spacing = 8;
const Wrapper = (Component) =>
  styled(Component)`
    ${({ $m, $ml, $mr, $mb }) => [
      $m ? `margin: ${$m * spacing}px` : '',
      $ml ? `margin-left: ${$ml * spacing}px` : '',
      $mr ? `margin-right: ${$mr * spacing}px` : '',
      $mb ? `margin-bottom: ${$mb * spacing}px` : '',
    ]}
  `;

export default Wrapper;
