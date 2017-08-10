import React from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router';
//Styles
import styled from 'styled-components';
import Colors from '../../styles/Colors';
import { lighten } from 'polished';
//Utilities
import {_logout} from '../../services/utilities';

const Navbar = (props) => {
    return(
        <div className="container-fluid">
            <nav className={`navbar navbar-toggleable-md navbar-light bg-faded ${props.className}`}>
                <a className="navbar-brand" href="/">{props.brand}</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/" activeClassName="active">My forms</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" onClick={_ => _logout()}>Log Out</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link user-link" activeClassName="active" to="/profile">Hello, {props.username}</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
};

Navbar.defaultProps = {
    brand: "Formette",
    username: "username",
};

Navbar.propTypes = {
    brand: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
};

// background-image: linear-gradient( 135deg, #CE9FFC 0%, #7367F0 100%) !important;

const NavbarWithStyles = styled(Navbar)`
    margin-bottom: 60px;
    .navbar-brand{
        font-size: 25px;
        font-weight: bold;
    }
    .nav-link{
       font-size: 20px;
       color: ${Colors.link.normal} !important;
        &:hover{
            color: ${Colors.link.highlight} !important;
            cursor: pointer;
        }
    }
    .user-link{
        color: ${Colors.link.highlight} !important;
        &:hover{
            color: ${Colors.link.normal} !important;
        }
    }
    .active{
        color: ${Colors.primary} !important;
        &:hover {
            color: ${lighten(0.1, Colors.primary)} !important;
        }
    }
    
`;

export default withRouter(NavbarWithStyles);
