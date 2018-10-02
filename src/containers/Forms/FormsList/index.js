// @flow
import React, { Component, Fragment } from "react";
import { graphql, compose } from "react-apollo";
//Container
import Tools from "./Tools";
import Cards from "./Cards";
//Components
import { Button, Icon } from "../../../components/atoms/index";
import { Graphic, Loader } from "../../../components/molecules/index";
//Utils
import { _refreshPage, _getUserId } from "../../../services/utilities";
//API
import { ALL_FORMS_QUERY } from "../../../api/Queries";

export class MyForms extends Component {
  props: {
    allFormsQuery: any,
    history: any
  };
  state = {
    loading: true,
    loadingTimeout: 0,
    hasError: ""
  };
  _goToNew = () => {
    this.props.history.push("/new");
  };
  render() {
    const { allFormses } = this.props.allFormsQuery;
    if (this.props.allFormsQuery && this.props.allFormsQuery.error) {
      return (
        <Graphic text="Ups! Something went wrong try again." icon="fa-plug">
          <Button className="btn btn-lg" onClick={_refreshPage} primary>
            Try Again
          </Button>
        </Graphic>
      );
    }
    return (
      <Fragment>
        <Tools
          title="My forms"
          description="Create, view and collect data for your applications"
          InputPlaceholder="Search forms"
        >
          <Button className="btn btn-lg" onClick={this._goToNew} primary>
            <Icon name="fas fa-plus" color="#FFF" /> New form
          </Button>
        </Tools>
        <div className="row">
          {this.props.allFormsQuery && this.props.allFormsQuery.loading ? (
            <Loader />
          ) : (
            <Cards data={allFormses} />
          )}
        </div>
      </Fragment>
    );
  }
}

export default compose(
  graphql(ALL_FORMS_QUERY, {
    name: "allFormsQuery",
    options: props => ({
      variables: { userId: _getUserId() }
    })
  })
)(MyForms);
