//Styles
import styled from "styled-components";

const HorizontalList = styled.ul`
  padding: 0;
  li {
    display: inline-block;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }

  @media (max-width: 375px) {
    li button span {
      display: none;
    }
  }
`;

export default HorizontalList;
