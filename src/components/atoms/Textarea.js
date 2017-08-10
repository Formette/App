import React from 'react';
import PropTypes from 'prop-types';
//Styles
import styled from 'styled-components';
import Colors from '../../styles/Colors';

const Textarea = (props) => <textarea className={`${props.className}`} placeholder={props.placeholder} {...props}/>;

Textarea.defaultProps = {
    placeholder: "Some text"
};

Textarea.propTypes = {
    placeholder: PropTypes.string.isRequired,
};

const TextareaWithStyles = styled(Textarea)`
    border-radius: 0;
    border-color: ${Colors.border};
    margin: 10px 0 10px 0;
    padding: 0.7rem 0.75rem;
`;

export default TextareaWithStyles;