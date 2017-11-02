// @flow
import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import * as moment from "moment";
//Components
import { Header, Button } from "../components/atoms/index";
import {
  Placeholder,
  PlaceholderAnimation,
  Card,
  Graphic
} from "../components/molecules/index";
//Utils
import { _refreshPage, _getUserId } from "../services/utilities";
import LogRocket from "logrocket";
//Styles
import Colors from "../styles/Colors";
//API
import { ALL_FORMS_QUERY } from "../api/Queries";

export class MyForms extends Component {
  props: {
    allFormsQuery: any,
    history: any
  };
  state = {
    loading: true,
    loadingTimeout: 0,
    hasError: "",
    data: []
  };
  _LoadingAnimationContent = (type: string = "loading", length: number = 6) => {
    const content = [];
    for (let i = 0; i <= length; i++) {
      if (type !== "loading") {
        content.push(<Placeholder key={i} width={208} height={193} />);
      } else {
        content.push(<PlaceholderAnimation key={i} />);
      }
    }
    return content;
  };
  _loadContent = () => {
    const { allFormses } = this.props.allFormsQuery;
    const formsCount = Object.keys(allFormses).length;
    const content = [];
    let length = 0;
    //checks if the number of forms created from the user
    if (formsCount === 0) {
      return this._LoadingAnimationContent("normal");
    }
    //Checks if the object data is not empty
    if (formsCount >= 0) {
      allFormses.map((res) => {
        content.push(
          <Card
            key={res.id}
            title={res.name}
            date={moment(res.createdAt).format("ll")}
            onClick={() => this.props.history.push(`/form/${res.id}`)}
          />
        );
        return true;
      });
      //for interface
      if (formsCount < 6) {
        length = 6 - Number(formsCount);
      }
      LogRocket.track("Loaded Forms");
      return content.concat(this._LoadingAnimationContent("normal", length));
    }
  };
  _goToNew = () => {
    this.props.history.push("/new");
  };
  render() {
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
      <div className="row">
        <div className="col-md-12 col-sm-12 col">
          <Header text="My Forms" />
          <Card
            icon="fa-plus"
            title="New Form"
            date="Create from scratch"
            onClick={this._goToNew}
            new
          />
          {this.props.allFormsQuery.loading ? (
            this._LoadingAnimationContent()
          ) : (
            <div>{this._loadContent()}</div>
          )}
        </div>
      </div>
    );
  }
}

const myFormsWithData = compose(
  graphql(ALL_FORMS_QUERY, {
    name: "allFormsQuery",
    options: (props) => ({
      variables: { userId: _getUserId() }
    })
  })
)(MyForms);

export default myFormsWithData;
