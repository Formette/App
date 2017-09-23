import React from "react";
import PropTypes from "prop-types";
//Components
import {Title, Text, Button, Link} from "../atoms/index";
//Styles
import Colors from "../../styles/Colors";
import styled from "styled-components";

const Confirmation = props => {
    return (
        <div className={`card mx-auto animated zoomInUp ${props.className}`} style={{display: props.show ? "inline" : "none"}}>
            <div className="card-body">
                <Title text={props.title}/>
                <Text text={props.description}/>
                <div className="text-right">
                    <Link className="cancelAction" onClick={_ => props.onCancel()}>Cancel</Link>
                    <Button className="btn" onClick={_ => props.onDelete()} color={Colors.red} textColor={Colors.white}>Delete</Button>
                </div>
            </div>
        </div>
    );
};

Confirmation.defaultProps = {
    title: "Form Title",
    description: "Form Date",
    show: false,
};

Confirmation.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
};

const ConfirmationWithStyled = styled(Confirmation)`
   width: 20rem;
   position: absolute; 
   left: 0; 
   right: 0; 
   z-index: 100;
   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
   .cancelAction{
      margin-right: 10px;
   }
`;

export default ConfirmationWithStyled;
