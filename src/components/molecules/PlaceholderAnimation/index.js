import React from "react";
//Components
import { Placeholder } from "../index";
//Styles
import styled from "styled-components";
import Color from "../../../styles/Colors";

const PlaceholderAnimation = props => {
  return (
    <Placeholder className={props.className} width={208} height={198}>
      <div className="animated-background">
        <div className="background-masker header-top">&zwnj;</div>
        <div className="background-masker header-left">&zwnj;</div>
        <div className="background-masker header-right">&zwnj;</div>
        <div className="background-masker header-bottom">&zwnj;</div>
        <div className="background-masker subheader-left">&zwnj;</div>
        <div className="background-masker subheader-right">&zwnj;</div>
        <div className="background-masker subheader-bottom">&zwnj;</div>
        <div className="background-masker content-top">&zwnj;</div>
        <div className="background-masker content-first-end">&zwnj;</div>
        <div className="background-masker content-second-line">&zwnj;</div>
        <div className="background-masker content-second-end">&zwnj;</div>
        <div className="background-masker content-third-line">&zwnj;</div>
        <div className="background-masker content-third-end">&zwnj;</div>
      </div>
    </Placeholder>
  );
};

PlaceholderAnimation.defaultProps = {
  width: 208,
  height: 198
};

const PlaceholderAnimationWithStyled = styled(PlaceholderAnimation)`
  background: ${Color.white};

  @keyframes placeHolderShimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  .animated-background {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
    height: 96px;
    position: relative;
  }

  .background-masker {
    background: #fff;
    position: absolute;
  }

  /* Every thing below this is just positioning */

  .background-masker.header-top,
  .background-masker.header-bottom,
  .background-masker.subheader-bottom {
    top: 0;
    left: 40px;
    right: 0;
    height: 10px;
  }

  .background-masker.header-left,
  .background-masker.subheader-left,
  .background-masker.header-right,
  .background-masker.subheader-right {
    top: 10px;
    left: 40px;
    height: 8px;
    width: 10px;
  }

  .background-masker.header-bottom {
    top: 18px;
    height: 6px;
  }

  .background-masker.subheader-left,
  .background-masker.subheader-right {
    top: 24px;
    height: 6px;
  }

  .background-masker.header-right,
  .background-masker.subheader-right {
    width: auto;
    left: 300px;
    right: 0;
  }

  .background-masker.subheader-right {
    left: 230px;
  }

  .background-masker.subheader-bottom {
    top: 30px;
    height: 10px;
  }

  .background-masker.content-top,
  .background-masker.content-second-line,
  .background-masker.content-third-line,
  .background-masker.content-second-end,
  .background-masker.content-third-end,
  .background-masker.content-first-end {
    top: 40px;
    left: 0;
    right: 0;
    height: 6px;
  }

  .background-masker.content-top {
    height: 20px;
  }

  .background-masker.content-first-end,
  .background-masker.content-second-end,
  .background-masker.content-third-end {
    width: auto;
    left: 380px;
    right: 0;
    top: 60px;
    height: 8px;
  }

  .background-masker.content-second-line {
    top: 68px;
  }

  .background-masker.content-second-end {
    left: 420px;
    top: 74px;
  }

  .background-masker.content-third-line {
    top: 82px;
  }

  .background-masker.content-third-end {
    left: 300px;
    top: 88px;
  }
`;

export default PlaceholderAnimationWithStyled;
