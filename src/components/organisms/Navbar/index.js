import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
//Styles
import styled from "styled-components";
import Colors from "../../../styles/Colors";
import { lighten } from "polished";
//Utilities
import { _logout } from "../../../services/utilities";

const Navbar = ({ className, username }) => {
  return (
    <nav className={`navbar navbar-expand-sm fixed-top ${className}`}>
      <a className="navbar-brand" href="/">
        <i className="fab fa-firstdraft" />
      </a>
      <button
        className={"navbar-toggler collapsed"}
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className={`fa fa-bars`} aria-hidden="true">
          &nbsp;
        </i>
      </button>
      <div className={`navbar-collapse collapse`} id="navbarCollapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <NavLink className="nav-link" activeClassName="active" to="/">
              <i className="fas fa-archive" />
              Forms
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/signin" onClick={_logout}>
              <i className="fas fa-sign-out-alt" /> Log Out
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              className="nav-link user-link"
              activeClassName="active"
              to="/profile"
            >
              <i className="fas fa-user-circle" /> Hello,{" "}
              <span>{username}</span>
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
  background: #7950f2;
  .navbar-brand {
    font-size: 25px;
    font-weight: bold;
    color: #fff;
    opacity: 0.6;
    &:hover {
      color: ${lighten(0.1, Colors.text.highlight)};
    }
    #HW_badge_cont {
      display: inline;
      position: absolute;
      left: 32px;
      top: 5px;
    }
  }
  .nav-link {
    font-size: 20px;
    color: #fff;
    opacity: 0.6;
    &:hover {
      color: ${Colors.link.highlight};
      cursor: pointer;
    }
  }
  .user-menu {
    &:hover {
      cursor: pointer;
    }
  }
  .user-link {
    color: #fff;
    opacity: 0.6;
    background: none;
    &:hover,
    &:active,
    &:focus {
      color: #fff;
      cursor: pointer;
      outline: none;
    }
  }
  li.active {
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 4px;
  }
  a.active {
    i {
      margin-right: 6px;
    }
  }
  a.active,
  a.active i {
    opacity: 1;
    color: #fff;
  }
  .navbar-toggler {
    outline: none;
  }
`;

export default withRouter(NavbarWithStyles);
