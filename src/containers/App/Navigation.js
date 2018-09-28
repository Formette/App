import React from "react";
import PropTypes from "prop-types";
import { compose } from "react-apollo";
import { NavLink, withRouter } from "react-router-dom";
//Styles
import styled, { withTheme } from "styled-components";
import { darken } from "polished";
//Utilities
import { _logout } from "../../services/utilities";

const Navbar = ({ className, username }) => {
  return (
    <nav className={`navbar navbar-expand-sm fixed-top ${className}`}>
      <a className="navbar-brand" href="/">
        <i className="fab fa-firstdraft" />
      </a>
      <div className={`navbar-collapse collapse`} id="navbarCollapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="active" to="/">
              <i className="fas fa-archive" />
              Forms
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/signin" onClick={_logout}>
              <i className="fas fa-sign-out-alt" />
              Log Out
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/profile"
            >
              <i className="fas fa-user-circle" />
              Hello, <span>{username}</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

Navbar.defaultProps = {
  brand: "Formette",
  username: "username"
};

Navbar.propTypes = {
  brand: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
};

const NavbarWithStyles = styled(Navbar)`
  background: ${props => props.theme.color.primary};
  box-shadow: ${props => props.theme.boxShadow};
  .navbar-brand {
    font-size: ${props => props.theme.navbar.brand.fontSize};
    font-weight: ${props => props.theme.navbar.brand.fontWeight};
    color: ${props => props.theme.navbar.brand.color};
    opacity: 0.6;
    margin-right: 50px;
    &:hover {
      color: ${props => darken(0.1, props.theme.navbar.brand.color)};
    }
    #HW_badge_cont {
      display: inline;
      position: absolute;
      left: 32px;
      top: 5px;
    }
  }
  .nav-link {
    font-size: ${props => props.theme.navbar.link.fontSize};
    color: ${props => props.theme.navbar.link.color};
    opacity: 0.6;
    &.active,
    &:hover {
      background-color: ${props => props.theme.navbar.link.hover};
      border-radius: ${props => props.theme.navbar.link.borderRadius};
      color: ${props => props.theme.navbar.link.color};
      opacity: 1;
    }
    i {
      margin-right: ${props => props.theme.navbar.link.marginRight};
    }
  }
`;

export default compose(
  withTheme,
  withRouter
)(NavbarWithStyles);
