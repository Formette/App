import React, { PureComponent } from "react";
import { graphql, compose } from "react-apollo";
//Containers
import Tools from "../FormsList/Tools";
//Components
import { Icon, Button, Text } from "../../../components/atoms";
import {
  Card,
  HorizontalList,
  Graphic,
  Loader
} from "../../../components/molecules";
//Utils
import * as moment from "moment";
import { withAlert } from "react-alert";
import LogRocket from "logrocket";
//Locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";
//API
import { FORM_CONTENT_DATA_QUERY } from "../../../api/Queries";
import { DELETE_FORM_CONTENT_MUTATION } from "../../../api/Mutations";
import { deleteFormContent } from "../../../api/Functions";

class ContentView extends PureComponent {
  state = {
    createdAt: ""
  };
  _generateContent = content => {
    const createdAt = moment(content.createdAt).format("ll");
    this.setState({
      createdAt
    });
    const result = [];
    for (let [key, value] of Object.entries(content.data[0])) {
      result.push(
        <span key={value}>
          <Text highlight>{key}</Text>
          <Text>{value}</Text>
        </span>
      );
    }
    return result;
  };
  _onDeleteContent = () => {
    const {
      deleteFormContentMutation,
      intl,
      alert,
      history,
      contentQuery,
      match
    } = this.props;
    const formId = contentQuery.Content.forms.id;
    const id = match.params.id;
    const response = deleteFormContent(id, formId, deleteFormContentMutation);
    if (response) {
      //Shows feedback and updates the store
      alert.success(
        intl.formatMessage(messages.AlertFormContentSuccessDeleted)
      );
      LogRocket.info("Form deleted successfully");
      LogRocket.track("Deleted Form Content");
      history.goBack();
    } else {
      LogRocket.error("Error on deleting form content");
      alert.error(intl.formatMessage(messages.GraphicErrorDescription));
    }
  };
  render() {
    const { intl, contentQuery, history, match } = this.props;
    if (contentQuery.Content === null) {
      return (
        <Graphic
          title={this.props.intl.formatMessage(messages.GraphicEmptyTitle)}
          description={this.props.intl.formatMessage(
            messages.GraphicEmptyDescription
          )}
          imgType="empty"
          top={200}
        >
          <Button
            className="btn btn-lg btn-primary"
            onClick={() => history.goBack()}
            primary
          >
            <FormattedMessage
              id="app.graphic.form.edit.error.action"
              defaultMessage={"Try Again"}
            />
          </Button>
        </Graphic>
      );
    }
    const { createdAt } = this.state;
    return (
      <div>
        <Tools
          title={`${intl.formatMessage(messages.PageContentViewTitle)} ${
            match.params.id
          }`}
          description={`${intl.formatMessage(
            messages.PageContentViewDescription
          )} ${createdAt}`}
          titleTruncate
        >
          <div className="col">
            <HorizontalList className="float-right">
              <li>
                <Button className="btn btn-lg" onClick={this._onDeleteContent}>
                  <Icon name="fas fa-trash" />
                </Button>
              </li>
            </HorizontalList>
          </div>
        </Tools>
        <div className="row">
          <div className="col-md-12">
            <Card>
              <div className="card-body">
                {contentQuery && contentQuery.loading ? (
                  <Loader top={5} />
                ) : (
                  this._generateContent(contentQuery.Content)
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withAlert,
  injectIntl,
  graphql(FORM_CONTENT_DATA_QUERY, {
    name: "contentQuery",
    options: props => ({
      variables: { id: props.match.params.id }
    })
  }),
  graphql(DELETE_FORM_CONTENT_MUTATION, { name: "deleteFormContentMutation" })
)(ContentView);
