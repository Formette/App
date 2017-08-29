import React from 'react';
import PropTypes from 'prop-types';
//Styles
import styled from 'styled-components';
import Colors from '../../styles/Colors';

const Graphic = (props) => {
    return(
        <div className={`${props.className} text-center `}>
            <i className={`fa ${props.icon}`}/>
            <p>{props.text}</p>
            {props.children}
        </div>
    )
};

Graphic.defaultProps = {
    icon: "fa-map-signs",
    text: "Text"
};

Graphic.propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

const GraphicWithStyles = styled(Graphic)`
    i{
        font-size: ${props => props.size || "100px"};
        color: ${props => props.iconColor || Colors.primary}
    }
    p{
        margin-top: 20px;
        padding: 0 100px 0 100px;
        color: ${props => props.textColor || Colors.text.secondary}
    }
`;

export default GraphicWithStyles;
