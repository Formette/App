import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router";
//Container
import Tools from "./Tools";
import Cards from "./Cards";
//Components
import { Button, Icon, InputGroup } from "../../../components/atoms/index";
import { Graphic, Loader } from "../../../components/molecules/index";
//Utils
import { _refreshPage, _onHandleExpression } from "../../../services/utilities";
//API
import { ALL_FORMS_QUERY } from "../../../api/Queries";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";

export class MyForms extends Component {
  static propTypes = {
    allFormsQuery: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    alert: PropTypes.object,
    intl: PropTypes.object.isRequired
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
      if (Object(allFormses).keys) {
        this.setState({
          data: allFormses,
          dataStatic: allFormses,
          isLoading: false
        });
        return;
      }
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
    const { allFormsQuery, intl } = this.props;
    const { allFormses } = allFormsQuery;
    const { isLoading, isSearching, data } = this.state;
    if (this.props.allFormsQuery.error) {
      return (
        <Graphic
          title={intl.formatMessage(messages.GraphicErrorTitle)}
          description={intl.formatMessage(messages.GraphicErrorDescription)}
          imgType="error"
          top={200}
        >
          <Button
            className="btn btn-lg btn-primary"
            onClick={_refreshPage}
            primary
          >
            <FormattedMessage
              id="app.graphic.error.action"
              defaultMessage={"Try Again"}
            />
          </Button>
        </Graphic>
      );
    }
    return (
      <Fragment>
        <Tools
          title={intl.formatMessage(messages.PageFormTitle)}
          description={intl.formatMessage(messages.PageFormDescription)}
          titleTruncate
          textTruncate
        >
          <div className="col">
            <InputGroup
              InputProps={{
                type: "text",
                className: "form-control",
                placeholder: intl.formatMessage(
                  messages.PageFormSearchPlaceholder
                ),
                defaultValue: this.state.searchQuery
              }}
              IconProps={{ name: "fas fa-search" }}
              onChange={e => this.setState({ searchQuery: e.target.value })}
              onKeyUp={e => this._onSearchFilter(e.target.value)}
            />
          </div>
          <div className="col">
            <Button className="btn btn-lg" onClick={this._goToNew} primary>
              <Icon name="fas fa-plus" color="#FFF" />{" "}
              <FormattedMessage
                id="app.page.form.action.new.form"
                defaultMessage={"New form"}
              />
            </Button>
          </div>
        </Tools>
        <div className="row">
          {isLoading || isSearching ? (
            <Loader top={100} />
          ) : Object.keys(allFormses).length === 0 ? (
            <Graphic
              title={intl.formatMessage(messages.GraphicFormEmptyTitle)}
              description={intl.formatMessage(
                messages.GraphicFormEmptyDescription
              )}
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
  injectIntl,
  withRouter,
  graphql(ALL_FORMS_QUERY, {
    name: "allFormsQuery",
    options: props => ({
      variables: { userId: props.userId }
    })
  })
)(MyForms);
