import PropTypes from "prop-types";
//Styles
import styled from "styled-components";

const Layout = styled.div`
  margin-top: ${props => props.top};
`;

Layout.defaultProps = {
  top: "100px"
};

Layout.propTypes = {
  top: PropTypes.string
};

export default Layout;
