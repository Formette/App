// @flow
import React, { Component, Fragment } from "react";
import { graphql, compose } from "react-apollo";
//Container
import Tools from "./Tools";
import Cards from "./Cards";
//Components
import { Button, Icon, InputGroup } from "../../../components/atoms/index";
import { Graphic, Loader } from "../../../components/molecules/index";
//Utils
import {
  _refreshPage,
  _getUserId,
  _onHandleExpression
} from "../../../services/utilities";
//API
import { ALL_FORMS_QUERY } from "../../../api/Queries";

export class MyForms extends Component {
  props: {
    allFormsQuery: any,
    history: any
  };
  state = {
    isLoading: true,
    isSearching: false,
    timeoutSearchFilter: 0,
    searchQuery: "",
    data: [],
    dataStatic: []
  };
  componentWillReceiveProps(nextProps) {
    const { allFormses } = nextProps.allFormsQuery;
    if (!nextProps.allFormsQuery.loading) {
      this.setState({
        data: allFormses,
        dataStatic: allFormses,
        isLoading: false
      });
      return;
    }
  }
  _goToNew = () => {
    this.props.history.push("/new");
  };
  _onSearchFilter() {
    clearTimeout(this.state.timeoutSearchFilter);
    this.setState({
      isSearching: true,
      timeoutSearchFilter: setTimeout(() => {
        const { searchQuery, dataStatic } = this.state;
        const { allFormses } = this.props.allFormsQuery;
        try {
          let search = new RegExp(
            _onHandleExpression(searchQuery.toLowerCase().trim())
          );
          //if the textbox is empty show all the dashboards again
          if (!searchQuery) {
            this.setState({ data: allFormses, isSearching: false });
            return;
          }
          //Filters dashboard with keyword on the search box
          let filtered = dataStatic.filter(item => {
            return (
              item.name
                .toLowerCase()
                .trim()
                .search(search) !== -1
            );
          });
          //Show message if the search is empty
          if (Object.keys(filtered).length <= 0) {
            console.log("não encontrou nada");
          }
          //Sets and shows the result
          this.setState({
            data: filtered,
            isSearching: false
          });
        } catch (error) {
          this.props.alert.error("error on search");
        }
      }, 200)
    });
  }
  render() {
    const { allFormses } = this.props.allFormsQuery;
    const { isLoading, isSearching, data } = this.state;
    if (this.props.allFormsQuery && this.props.allFormsQuery.error) {
      return (
        <Graphic
          title="Error..."
          description="Ups! Something went wrong try again."
          imgType="error"
        >
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
          titleTruncate
          textTruncate
        >
          <div className="col">
            <InputGroup
              InputProps={{
                type: "text",
                className: "form-control",
                placeholder: "Search forms",
                defaultValue: this.state.searchQuery
              }}
              IconProps={{ name: "fas fa-search" }}
              onChange={e => this.setState({ searchQuery: e.target.value })}
              onKeyUp={e => this._onSearchFilter(e.target.value)}
            />
          </div>
          <div className="col">
            <Button className="btn btn-lg" onClick={this._goToNew} primary>
              <Icon name="fas fa-plus" color="#FFF" /> New form
            </Button>
          </div>
        </Tools>
        <div className="row">
          {isLoading || isSearching ? (
            <Loader />
          ) : Object.keys(allFormses).length === 0 ? (
            <Graphic
              title="No forms created"
              description="No form has been created yet, start by creating a new one and then added to your site to collect data"
              imgType="empty"
              top={55}
            />
          ) : (
            <Cards data={data} />
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
