import React, { PureComponent } from "react";
import PropTypes from "prop-types";
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
import { Layout } from "../../../components/organisms";
import Dropdown, {
  DropdownItemGroup,
  DropdownItem
} from "@atlaskit/dropdown-menu";
//Utils
// eslint-disable-next-line
import * as moment from "moment";
import { withAlert } from "react-alert";
import LogRocket from "logrocket";
import { downloadCSV } from "@vacom/vantage";
import * as jsPDF from "jspdf";
//Locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";
//API
import { FORM_CONTENT_DATA_QUERY } from "../../../api/Queries";
import { DELETE_FORM_CONTENT_MUTATION } from "../../../api/Mutations";
import { deleteFormContent } from "../../../api/Functions";

class ContentView extends PureComponent {
  static propTypes = {
    deleteFormContentMutation: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    contentQuery: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired
  };
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
  _onGenerateCSV = () => {
    const { match, contentQuery, intl } = this.props;
    const args = { filename: `${match.params.id}.csv` };
    const data = contentQuery.Content.data;
    //validates if has content to export
    if (Object.keys(data).length === 0) {
      alert.show(intl.formatMessage(messages.AlertFormExportEmpty));
      return;
    }
    downloadCSV(args, data);
  };
  _onGeneratePDF = () => {
    const { match, intl } = this.props;
    let doc = new jsPDF();
    const source = document.getElementById("renderToExport");
    let specialElementHandlers = {
      "#editor": () => {
        return true;
      }
    };
    doc.text(
      `${intl.formatMessage(messages.PageContentViewTitle)} ${match.params.id}`,
      15,
      15
    );
    doc.text(
      `${intl.formatMessage(messages.PageContentViewDescription)} ${
        this.state.createdAt
      }`,
      15,
      24
    );
    doc.fromHTML(source, 15, 30, {
      width: 170,
      elementHandlers: specialElementHandlers
    });
    doc.save(`${match.params.id}.pdf`);
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
      <Layout>
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
                <Dropdown
                  trigger={
                    <Button className="btn btn-lg">
                      <Icon name="fas fa-download" />
                    </Button>
                  }
                  isMenuFixed={true}
                  position="bottom right"
                >
                  <DropdownItemGroup
                    title={this.props.intl.formatMessage(
                      messages.PageFormCardActionsExport
                    )}
                  >
                    <DropdownItem onClick={this._onGeneratePDF}>
                      <Icon name="fas fa-file-pdf" />{" "}
                      <FormattedMessage
                        id="app.page.form.card.action.export.pdf"
                        defaultMessage={"PDF"}
                      />
                    </DropdownItem>
                    <DropdownItem onClick={this._onGenerateCSV}>
                      <Icon name="fas fa-file" />{" "}
                      <FormattedMessage
                        id="app.page.form.card.action.export.csv"
                        defaultMessage={"CSV"}
                      />
                    </DropdownItem>
                  </DropdownItemGroup>
                </Dropdown>
              </li>
              <li>
                <Button
                  className="btn btn-lg"
                  onClick={this._onDeleteContent}
                  primary
                >
                  <Icon name="fas fa-trash" />
                </Button>
              </li>
            </HorizontalList>
          </div>
        </Tools>
        <div className="row">
          <div className="col-md-12">
            <Card>
              <div id="renderToExport" className="card-body">
                {contentQuery && contentQuery.loading ? (
                  <Loader top={5} />
                ) : (
                  this._generateContent(contentQuery.Content)
                )}
              </div>
            </Card>
          </div>
        </div>
      </Layout>
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
