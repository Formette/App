import React from "react";
import PropTypes from "prop-types";
import { compose } from "react-apollo";
import { NavLink, withRouter } from "react-router-dom";
//Components
import { Icon } from "../../components/atoms";
import Dropdown, {
  DropdownItemGroup,
  DropdownItem
} from "@atlaskit/dropdown-menu";
//Styles
import styled, { withTheme } from "styled-components";
import { darken } from "polished";
//Utilities
import { _logout } from "../../services/utilities";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../locales/api";

const Navbar = ({ className, username, intl }) => {
  return (
    <nav className={`navbar navbar-expand-sm fixed-top ${className}`}>
      <a className="navbar-brand" href="#/">
        <i className="fas fa-box" />
      </a>
      <div className={`navbar-collapse collapse`} id="navbarCollapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="active" to="/">
              <i className="fas fa-archive" />
              <FormattedMessage
                id="app.navigation.forms"
                defaultMessage={"Forms"}
              />
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav">
          <Dropdown
            trigger={
              <li className="nav-item">
                <a className="nav-link">
                  <Icon name="fas fa-bars" />
                  <FormattedMessage
                    id="app.navigation.greetings"
                    defaultMessage={"Hello,"}
                  />{" "}
                  <span>{username}</span>
                </a>
              </li>
            }
            isMenuFixed={true}
            position="bottom right"
          >
            <DropdownItemGroup
              title={intl.formatMessage(messages.PageNavMenuSetting)}
            >
              <DropdownItem href={`#/profile`}>
                <Icon name="fas fa-user-circle" />{" "}
                <FormattedMessage
                  id="app.navigation.profile"
                  defaultMessage={"Profile"}
                />
              </DropdownItem>
            </DropdownItemGroup>
            <DropdownItemGroup
              title={intl.formatMessage(messages.PageNavMenuHelp)}
            >
              <DropdownItem href={`http://bit.ly/formetteDocs`} target="_blank">
                <Icon name="fas fa-book" />{" "}
                <FormattedMessage
                  id="app.page.footer.link.docs"
                  defaultMessage={"Docs"}
                />
              </DropdownItem>
              <DropdownItem
                href="http://bit.ly/formetteprivacy"
                target="_blank"
              >
                <Icon name="fas fa-lock" />{" "}
                <FormattedMessage
                  id="app.page.footer.link.terms"
                  defaultMessage={"Terms & Privacy Policy"}
                />
              </DropdownItem>
              <DropdownItem href="http://bit.ly/formetteStatus" target="_blank">
                <Icon name="fas fa-server" />{" "}
                <FormattedMessage
                  id="app.page.footer.link.status"
                  defaultMessage={"Status"}
                />
              </DropdownItem>
              <DropdownItem
                href="http://bit.ly/formettethirdpartysoftware"
                target="_blank"
              >
                <Icon name="fas fa-code" />{" "}
                <FormattedMessage
                  id="app.page.footer.link.software"
                  defaultMessage={"Third-party Software"}
                />
              </DropdownItem>
            </DropdownItemGroup>
            <DropdownItemGroup
              title={intl.formatMessage(messages.PageNavMenuActions)}
            >
              <DropdownItem onClick={_logout}>
                <Icon name="fas fa-sign-out-alt" />{" "}
                <FormattedMessage
                  id="app.navigation.logout"
                  defaultMessage={"Log Out"}
                />
              </DropdownItem>
            </DropdownItemGroup>
          </Dropdown>
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
  a.nav-link,
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
      cursor: pointer;
    }
    i {
      margin-right: ${props => props.theme.navbar.link.marginRight};
    }
  }
`;

export default compose(
  withTheme,
  injectIntl,
  withRouter
)(NavbarWithStyles);
