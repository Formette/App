// @flow
import React, { Component } from "react";
//Components
import { Button } from "../atoms/index";
import { Graphic } from "../molecules/index";

const withLoader = (WrappedComponent, selectData) => {
  // ...and returns another component...
  return class extends Component {
    render() {
      if (this.props.allFormsQuery && this.props.allFormsQuery.loading) {
        return <div>Loading</div>;
      }
      if (this.props.allFormsQuery && this.props.allFormsQuery.error) {
        return (
          <Graphic text="Ups! Something went wrong try again." icon="fa-plug">
            <Button
              className="btn btn-lg btn-primary"
              color={Colors.primary}
              onClick={_refreshPage}
            >
              Try Again
            </Button>
          </Graphic>
        );
      }
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
};

export default withLoader;
