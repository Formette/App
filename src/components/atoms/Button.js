import React from 'react';
import PropTypes from 'prop-types';
//Styles
import styled from 'styled-components';
import Color from '../../styles/Colors';
import { lighten } from 'polished';

const Button = (props) => <button type={props.type} className={`${props.className}`} {...props}>{props.children}</button>;

Button.defaultProps = {
    type: "button",
    children: "text",
    color: Color.primary,
};

Button.propTypes = {
    type: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    color: PropTypes.string.isRequired
};

const ButtonWithStyles = styled(Button)`
    border-radius: 0;
    background: ${(props) => props.color};
    border: 0; 
    cursor: pointer;
    &:hover{
        background: ${(props) => lighten(0.1, props.color)};
    }
`;

export default ButtonWithStyles;