import React from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
//Components
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown
} from "reactstrap";
//Styles
import styled from "styled-components";
import Colors from "../../../styles/Colors";
import { lighten } from "polished";
//Utilities
import { _logout } from "../../../services/utilities";

class Navbar extends React.PureComponent {
  state = {
    show: false,
    shadowScroll: false
  };
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    this.setState({
      shadowScroll: window.scrollY > 10
    });
  };
  _openDrawer = () => {
    this.setState(prevState => ({
      show: !prevState.show
    }));
  };
  render() {
    const { show, shadowScroll } = this.state;
    return (
      <nav
        className={`navbar navbar-expand-sm fixed-top ${this.props.className}`}
        style={
          shadowScroll
            ? {
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
              }
            : null
        }
      >
        <a className="navbar-brand" href="/">
          {this.props.brand}
        </a>
        <button
          className={"navbar-toggler collapsed"}
          type="button"
          onClick={this._openDrawer}
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i
            className={`fa ${show ? "fa-times" : "fa-bars"}`}
            aria-hidden="true"
          >
            &nbsp;
          </i>
        </button>
        <div
          className={`navbar-collapse collapse ${show ? "show" : ""}`}
          id="navbarCollapse"
        >
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <NavLink className="nav-link" activeClassName="active" to="/">
                My forms
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            {/*<li className="nav-item">
              <NavLink
                className="nav-link"
                to="/signin"
                onClick={_logout}
              >
                Log Out
              </NavLink>
            </li>*/}
            <li>
              <UncontrolledDropdown className="user-menu">
                <DropdownToggle caret>
                  Hello, <span>{this.props.username}</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => this.props.history.push("/profile")}
                    className="user-link"
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className="user-link">Docs</DropdownItem>
                  <DropdownItem className="user-link">Changelog</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={_logout} className="user-link">
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </li>
            {/*<li className="nav-item">
              <NavLink
                className="nav-link user-link"
                activeClassName="active"
                to="/profile"
              >
                Hello, <span>{this.props.username}</span>
              </NavLink>
            </li>*/}
          </ul>
        </div>
      </nav>
    );
  }
}

Navbar.defaultProps = {
  brand: "Formette",
  username: "username"
};

Navbar.propTypes = {
  brand: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};

const NavbarWithStyles = styled(Navbar)`
  background: ${Colors.background};
  .navbar-brand {
    font-size: 25px;
    font-weight: bold;
    color: ${Colors.text.highlight};
    &:hover {
      color: ${lighten(0.1, Colors.text.highlight)};
    }
    #HW_badge_cont {
      display: inline;
      position: absolute;
      left: 135px;
      top: 5px;
    }
  }
  .nav-link {
    font-size: 20px;
    color: ${Colors.link.normal};
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
    color: ${Colors.link.highlight};
    background: none;
    &:hover,
    &:active,
    &:focus {
      color: ${Colors.primary};
      cursor: pointer;
      outline: none;
    }
  }
  .active {
    color: ${Colors.primary};
    &:hover {
      color: ${lighten(0.1, Colors.primary)};
    }
  }
  .navbar-toggler {
    outline: none;
  }
`;

export default withRouter(NavbarWithStyles);
