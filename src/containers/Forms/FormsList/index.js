// @flow
import React, { Component, Fragment } from "react";
import { graphql, compose } from "react-apollo";
//Container
import Tools from "./Tools";
import Cards from "./Cards";
//Components
import { Button, Icon } from "../../../components/atoms/index";
import { Graphic } from "../../../components/molecules/index";
//Utils
import { _refreshPage, _getUserId } from "../../../services/utilities";
//Styles
import Colors from "../../../styles/Colors";
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
    return (
      <Fragment>
        <Tools
          title="My forms"
          description="Create, view and collect that for your applications"
          InputPlaceholder="Search forms"
        >
          <Button className="btn btn-lg" onClick={this._goToNew} primary>
            <Icon name="fas fa-plus" color="#FFF" /> New form
          </Button>
        </Tools>
        <div className="row">
          <Cards data={allFormses} />
        </div>
      </Fragment>
    );
  }
}

const myFormsWithData = compose(
  graphql(ALL_FORMS_QUERY, {
    name: "allFormsQuery",
    options: props => ({
      variables: { userId: _getUserId() }
    })
  })
)(MyForms);

export default myFormsWithData;
