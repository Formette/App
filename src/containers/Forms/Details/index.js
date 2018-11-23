import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
//Containers
import Tools from "../FormsList/Tools";
import Table from "./Table";
//Components
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Icon } from "../../../components/atoms";
import {
  Card,
  HorizontalList,
  Graphic,
  Confirmation,
  Loader
} from "../../../components/molecules";
import Dropdown, {
  DropdownItemGroup,
  DropdownItem
} from "@atlaskit/dropdown-menu";
//hocs
import { withUser } from "../../../hocs";
//Utils
import { _refreshPage, downloadCSV } from "../../../services/utilities";
import LogRocket from "logrocket";
import { withAlert } from "react-alert";
import * as jsPDF from "jspdf";
// eslint-disable-next-line
import * as jsPDFAutoTable from "jspdf-autotable";
//API
import { FORM_DATA_QUERY } from "../../../api/Queries";
import { DELETE_FORM_MUTATION } from "../../../api/Mutations";
import { FORM_DATA_SUBSCRIPTION } from "../../../api/Subscriptions";
import { deleteForm } from "../../../api/Functions";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";

export class FormDetails extends PureComponent {
  static propTypes = {
    formDataQuery: PropTypes.object.isRequired,
    deleteFormMutation: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };
  state = {
    onConfirmation: false,
    url: `${process.env.REACT_APP_ENDPOINT_URL}`
  };

  componentWillMount() {
    this._subscribeToNewData();
  }
  _subscribeToNewData = () => {
    const id = this.props.match.params.id;
    this.props.formDataQuery.subscribeToMore({
      document: FORM_DATA_SUBSCRIPTION,
      variables: { id },
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return previous;
        }
        const newItems = subscriptionData.data.Content.node;
        const result = Object.assign({}, previous, {
          Forms: {
            ...previous.Forms,
            contents: [newItems, ...previous.Forms.contents]
          }
        });
        LogRocket.debug({ subscriptionData: result });
        return result;
      }
    });
  };
  _showConfirmation = () => {
    this.setState(prevState => ({
      onConfirmation: !prevState.onConfirmation
    }));
    LogRocket.track("Opened delete modal on Form Details");
  };
  _onDeleteForm = async () => {
    //deletes the form in the DB
    const { intl, match, alert, user } = this.props;
    const { id } = match.params;
    const userId = user.state.profile.id;
    const response = deleteForm(id, userId, this.props.deleteFormMutation);
    if (response) {
      //Shows feedback and updates the store
      alert.success(intl.formatMessage(messages.AlertFormSuccessDeleted));
      LogRocket.info("Form deleted successfully");
      LogRocket.track("Deleted Form");
      //redirects the user to the main page
      this.props.history.push("/");
    } else {
      LogRocket.warn(
        "What a disgrace but it was not possible to delete the form, try again."
      );
      alert.error(intl.formatMessage(messages.AlertFormErrorDelete));
    }
  };
  _editForm = () => {
    this.props.history.push(`/edit/${this.props.match.params.id}`);
  };
  _onGenerateCSV = () => {
    const { match, formDataQuery, alert, intl } = this.props;
    const { contents, name } = formDataQuery.Forms;
    if (Object.keys(contents).length === 0) {
      alert.show(intl.formatMessage(messages.AlertFormExportEmpty));
      return;
    }
    const args = { filename: `${name || match.params.id}.csv` };
    const result = [];
    contents.map(item => {
      let { id, data, createdAt } = item;
      result.push({
        id,
        ...data[0],
        createdAt
      });
      return true;
    });
    downloadCSV(args, result);
  };
  _onGeneratePDF = () => {
    const { match, formDataQuery, intl, alert } = this.props;
    const { name, contents } = formDataQuery.Forms;
    //validates if has content to export
    if (Object.keys(contents).length === 0) {
      alert.show(intl.formatMessage(messages.AlertFormExportEmpty));
      return;
    }
    const columns = [];
    const rows = [];
    const keys = Object.keys(contents[0].data[0]);
    const dateKey = Object.keys(contents[0]);
    keys.map(item => {
      if (item !== "__typename") {
        columns.push(item);
      }
      return true;
    });
    columns.push(dateKey[2]);
    contents.map(item => {
      let data = Object.values(item.data[0]);
      rows.push(data.concat(item.createdAt));
      return true;
    });
    // Only pt supported (not mm or in)
    let doc = new jsPDF("p", "pt");
    doc.text(`${name || match.params.id}`, 38, 25);
    doc.autoTable(columns, rows);
    doc.save(`${name || match.params.id}.pdf`);
  };
  render() {
    if (this.props.formDataQuery && this.props.formDataQuery.loading) {
      return <Loader top={100} />;
    }
    if (this.props.formDataQuery.error) {
      return (
        <Graphic
          title={this.props.intl.formatMessage(messages.GraphicErrorTitle)}
          description={this.props.intl.formatMessage(
            messages.GraphicErrorDescription
          )}
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
    if (this.props.formDataQuery.Forms === null) {
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
            onClick={() => this.props.history.push("/")}
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
    const {
      name,
      description,
      endpoint,
      contents,
      isDisabled
    } = this.props.formDataQuery.Forms;
    const point = endpoint.split("/");
    const { onConfirmation, url } = this.state;
    const { intl, user, alert, match } = this.props;
    const { userName } = user.state;
    return (
      <div>
        <Confirmation
          title={intl.formatMessage(messages.ModalFormDeleteTitle)}
          description={intl.formatMessage(messages.ModalFormDeleteDescription)}
          show={onConfirmation}
          onConfirmationText={intl.formatMessage(
            messages.ModalFormDeleteActionTextPrimary
          )}
          onCancelText={intl.formatMessage(
            messages.ModalFormDeleteActionTextCancel
          )}
          onCancel={this._showConfirmation}
          onConfirmation={this._onDeleteForm}
          actionProps={{ danger: true }}
        />
        <Tools
          title={name || intl.formatMessage(messages.PageFormDetailsTitle)}
          description={
            description ||
            intl.formatMessage(messages.PageFormDetailsDescription)
          }
          titleTruncate
          isDisabled={isDisabled}
          isDisabledText={intl.formatMessage(
            messages.PageFormDetailsDisableText
          )}
        >
          {/* <div className="col">
            <InputGroup
              InputProps={{
                type: "text",
                className: "form-control",
                placeholder: "Search forms"
              }}
              IconProps={{ name: "fas fa-search" }}
            />
          </div>
          */}
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
                <Button className="btn btn-lg" onClick={this._editForm}>
                  <Icon name="fas fa-pen" />
                </Button>
              </li>
              <li>
                <Button className="btn btn-lg" onClick={this._showConfirmation}>
                  <Icon name="fas fa-trash" />
                </Button>
              </li>
              <li>
                <CopyToClipboard
                  text={`${url}/${userName}/${point[1]}`}
                  style={{ cursor: "pointer" }}
                  onCopy={() =>
                    alert.success(
                      intl.formatMessage(messages.AlertFormSuccessCopied)
                    )
                  }
                >
                  <Button className="btn btn-lg" primary>
                    <Icon name="fas fa-link" />
                    <span>
                      <FormattedMessage
                        id="app.page.form.details.action.copy.endpoint"
                        defaultMessage={"Endpoint"}
                      />
                    </span>
                  </Button>
                </CopyToClipboard>
              </li>
            </HorizontalList>
          </div>
        </Tools>
        <div className="row">
          <div className="col-md-12">
            <Card>
              <div className="card-body">
                <Table
                  formId={match.params.id}
                  data={contents}
                  emptyText={intl.formatMessage(messages.FormEmptyTitle)}
                  emptyDescription={intl.formatMessage(
                    messages.FormEmptyDescription
                  )}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withUser,
  injectIntl,
  withAlert,
  graphql(FORM_DATA_QUERY, {
    name: "formDataQuery",
    options: props => ({
      variables: { id: props.match.params.id }
    })
  }),
  graphql(DELETE_FORM_MUTATION, { name: "deleteFormMutation" })
)(FormDetails);
