import React from "react";
import PropTypes from "prop-types";
//Components
import {Title, SubTitle, Icon} from "../atoms/index";

//Styles
import Colors from "../../styles/Colors";
import styled from "styled-components";
import {darken} from "polished";
//Utilities
import {random} from "../../services/utilities";

const colors = ["#7568F0", "#8A75F3", "#A384F6", "#A384F6", "#CA9CFB"];

const Card = props => {
    return (
        <div
            className={`card text-center ${props.className}`}
            onClick={props.onClick}
        >
            <div className="card-body">
                <Icon
                    name={props.icon}
                    color={`${props.new ? Colors.white : colors[random(0, 4)]}`}
                    size={70}
                />

                <Title
                    className="card-title text-truncate"
                    color={`${props.new ? Colors.text.white : Colors.text.normal}`}
                    text={props.title}
                />

                <SubTitle
                    className={`card-subtitle mb-2 ${props.new ? "" : "text-muted"}`}
                    color={`${props.new ? Colors.text.white : Colors.text.normal}`}
                    text={props.date}
                />
            </div>
        </div>
    );
};

Card.defaultProps = {
    title: "Form Title",
    date: "Form Date",
    icon: "fa-file-text-o"
};

Card.propTypes = {
    title: PropTypes.string,
    date: PropTypes.string,
    icon: PropTypes.string
};

const CardWithStyled = styled(Card)`
    background-image: ${props =>
    props.new
        ? "linear-gradient( 135deg, #CE9FFC 0%, #7367F0 100%)"
        : Colors.card.normal};
    width: 13rem;
    float: left;
    margin: 0 10px 10px 0;
    cursor: pointer;
    &:hover {
       background: ${props =>
    props.new ? "" : darken(0.1, Colors.card.normal)};
    }
    &:last-child {
      margin: 0;
    }
    i {
       margin-bottom: 20px;
    }
    span {
        margin-bottom: .75rem;
        font-size: 1.75rem;
        font-family: inherit;
        font-weight: 500;
        line-height: 1.1;
        display: block;
    }
    @media (max-width: 465px) {
		width: 7rem;
		i{
		   font-size: 50px;
		}
		h3, span{
		    font-size: 15px;
		}
		h6{
		    font-size: 7px;
		}
	}
`;

export default CardWithStyled;
