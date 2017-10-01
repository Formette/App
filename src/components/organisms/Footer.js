import React from "react";
//Components
import { Link } from "../atoms/index";
//Styles
import styled from "styled-components";

const url = "http://www.formette.com";
const Footer = (props) => {
  return (
    <div className={`container-fluid ${props.className}`}>
      <ul>
        <li>
          <Link href={`${url}/about`} target="_blank">
            About
          </Link>
        </li>
        <li>
          <Link href={`${url}/docs`} target="_blank">
            Docs
          </Link>
        </li>
        <li>
          <Link href={`${url}/roadmap`} target="_blank">
            Roadmap
          </Link>
        </li>
        <li>
          <Link href={`${url}/terms`} target="_blank">
            Terms
          </Link>
        </li>
        <li>
          <Link href={`${url}/privacy`} target="_blank">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link href={`${url}/feedback`} target="_blank">
            Feedback
          </Link>
        </li>
      </ul>
    </div>
  );
};

const FooterWithStyled = styled(Footer)`
  height: 40px;
  ul {
    margin: 0;
    padding-top: 8px;
    li {
      display: inline;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  @media (max-width: 991px) {
    margin-top: 20px;
  }
  @media (max-width: 480px) {
    text-align: center;
    margin-top: 20px;
    ul {
      padding-left: 0;
      li a {
        font-size: 10px;
      }
    }
  }
`;

export default FooterWithStyled;
