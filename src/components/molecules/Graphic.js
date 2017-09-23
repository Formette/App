import React from 'react';
import PropTypes from 'prop-types';
//Components
import {Text, Icon} from '../atoms/index';
//Styles
import styled from 'styled-components';
import Colors from '../../styles/Colors';

const Graphic = (props) => {
    return(
        <div className={`${props.className} text-center `}>
            <Icon name={props.icon}/>
            <Text text={props.text}/>
            {props.children}
        </div>
    )
};

Graphic.defaultProps = {
    icon: "fa-map-signs",
    text: "Text",
    iconColor: Colors.text.secondary
};

Graphic.propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    iconColor: PropTypes.string,
};

const GraphicWithStyles = styled(Graphic)`
    i{
        font-size: ${props => props.size || "100px"};
        color: ${props => props.iconColor || Colors.text.secondary}
    }
    p{
        margin-top: 20px;
        padding: 0 100px 0 100px;
        color: ${props => props.textColor || Colors.text.secondary};
        font-size: 20px;
    }
`;

export default GraphicWithStyles;
