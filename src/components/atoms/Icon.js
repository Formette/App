import React from 'react';
import PropTypes from 'prop-types';
//Styles
import styled from 'styled-components';
import Colors from '../../styles/Colors';

const Icon = (props) => <i className={`fa ${props.name} ${props.className}`} style={props.style}>&zwnj;</i>;

Icon.defaultProps = {
    name: "fa-file-text-o",
    color: "#000000",
    size: 20,
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.number,
};

const IconWithStyles = styled(Icon)`
    font-size: ${props => props.size || 20}px;
    color: ${props => props.color || Colors.text.normal}
`;

export default IconWithStyles;