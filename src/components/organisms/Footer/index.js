import React from "react";
import PropTypes from "prop-types";
//Components
import { Link } from "../../atoms/index";
//Styles
import styled from "styled-components";

const url = "formette.com";
const protocol = "https://";
const Footer = props => {
  return (
    <div className={`container-fluid ${props.className}`}>
      <ul>
        <li>
          <Link href={`${protocol}docs.${url}`} target="_blank">
            Docs
          </Link>
        </li>
        <li>
          <Link
            href={`https://www.iubenda.com/privacy-policy/54274847/legal?ifr=true&height=690`}
            target="_blank"
          >
            Terms & Privacy Policy
          </Link>
        </li>
        <li>
          <Link
            href={`https://statuspage.freshping.io/263-Formette`}
            target="_blank"
          >
            Status
          </Link>
        </li>
        <li>
          <Link
            href={`https://formette.freshdesk.com/support/home`}
            target="_blank"
          >
            Feedback
          </Link>
        </li>
      </ul>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
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
