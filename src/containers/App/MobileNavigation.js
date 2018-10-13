import React from "react";
import PropTypes from "prop-types";
import { compose } from "react-apollo";
import { NavLink, withRouter } from "react-router-dom";
//components
import { Button, Icon } from "../../components/atoms/index";
import { HorizontalList } from "../../components/molecules/index";
//Styles
import styled, { withTheme } from "styled-components";
import { darken } from "polished";

const MobileNavigation = ({ className }) => {
  return (
    <nav className={`navbar fixed-bottom ${className}`}>
      <ul className="nav mx-auto">
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="active" to="/">
            <i className="fas fa-archive" />
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="active" to="/new">
            <i className="fas fa-plus" />
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" activeClassName="active" to="/profile">
            <i className="fas fa-user-circle" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

MobileNavigation.defaultProps = {
  brand: "Formette"
};

MobileNavigation.propTypes = {
  brand: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
};

const MobileNavbarWithStyles = styled(MobileNavigation)`
  display: none;
  background: ${props => props.theme.mobileNavbar.backgroundColor};
  box-shadow: 0 -2px 6px -2px rgba(0, 0, 0, 0.2);
  li {
    margin-right: 24px;
    &:last-child {
      margin-right: 0;
    }
    .nav-link {
      color: ${props => props.theme.link.active};
      opacity: 0.6;
      &.active,
      &:hover {
        background-color: ${props => props.theme.navbar.link.hover};
        border-radius: ${props => props.theme.mobileNavbar.link.borderRadius};
        color: ${props => props.theme.mobileNavbar.link.color};
        opacity: 1;
      }
      i {
        font-size: 25px;
      }
    }
  }
  @media (max-width: 576px) {
    display: flex;
  }
`;

export default compose(
  withTheme,
  withRouter
)(MobileNavbarWithStyles);
