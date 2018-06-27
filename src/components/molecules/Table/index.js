import React from "react";
//Styles
import styled from "styled-components";
import Colors from "../../../styles/Colors";

const Table = props => <div>Hello</div>;

/*<JsonTable
    className={`table thead-inverse ${props.className}`}
    rows={props.data}
  />*/

const TableWithStyles = styled(Table)`
  tr {
    &:hover {
      background: ${Colors.card.hover};
      cursor: pointer;
    }
  }
  @media (max-width: 480px) {
    display: block;
    width: 100%;
    overflow-x: auto;
  }
`;

export default TableWithStyles;
