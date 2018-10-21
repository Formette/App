import React, { PureComponent, Fragment } from "react";
//Components
import { Button, Icon, Link } from "../../../components/atoms";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Graphic,
  Confirmation
} from "../../../components/molecules";
import CopyToClipboard from "react-copy-to-clipboard";
import Dropdown, {
  DropdownItemGroup,
  DropdownItem
} from "@atlaskit/dropdown-menu";
//hocs
import { withUser } from "../../../hocs";
//Utils
import moment from "moment";
import { random } from "../../../services/utilities";
import { withAlert } from "react-alert";
import LogRocket from "logrocket";
//API
import { graphql, compose } from "react-apollo";
import { DELETE_FORM_MUTATION } from "../../../api/Mutations";
import { deleteForm } from "../../../api/Functions";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";

const colors = ["#7568F0", "#8A75F3", "#A384F6", "#A384F6", "#CA9CFB"];
class Cards extends PureComponent {
  state = {
    url: `${process.env.REACT_APP_ENDPOINT_URL}`,
    onConfirmation: false,
    formId: null
  };
  _onDeleteForm = async () => {
    //deletes the form in the DB
    const { alert, intl, user, deleteFormMutation } = this.props;
    const { formId: id } = this.state;
    const userId = user.state.profile.id;
    const response = deleteForm(id, userId, deleteFormMutation);
    if (response) {
      //Shows feedback and updates the store
      alert.success(intl.formatMessage(messages.AlertFormSuccessDeleted));
      LogRocket.info("Form deleted successfully from form list");
      LogRocket.track("Deleted Form");
      this.setState({ onConfirmation: false, formId: null });
    } else {
      LogRocket.warn(
        "What a disgrace but it was not possible to delete the form, try again."
      );
      alert.error(intl.formatMessage(messages.AlertFormErrorDelete));
    }
  };
  _showConfirmation = formId => {
    this.setState(prevState => ({
      formId,
      onConfirmation: !prevState.onConfirmation
    }));
    LogRocket.track("Opened delete modal on Form Details");
  };
  render() {
    const { data, alert, user, intl } = this.props;
    const { onConfirmation } = this.state;
    if (Object.keys(data).length === 0) {
      return (
        <Graphic
          title={intl.formatMessage(messages.GraphicSearchTitle)}
          description={intl.formatMessage(messages.GraphicSearchDescription)}
          imgType="notfound"
          top={55}
        />
      );
    }
    return (
      <Fragment>
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
        {data.map(item => {
          return (
            <div
              key={item.id}
              className="col-12 col-sm-12 col-md-4 col-lg-3"
              style={{ marginBottom: "30px" }}
            >
              <Card className="animated fadeIn">
                <CardHeader>
                  <span style={{ float: "right" }}>
                    <Dropdown
                      trigger={
                        <Link className="text-muted">
                          <Icon name="fas fa-ellipsis-v" />
                        </Link>
                      }
                      isMenuFixed={true}
                      position="bottom right"
                    >
                      <DropdownItemGroup title="Actions">
                        <DropdownItem href={`#/edit/${item.id}`}>
                          <Icon name="fas fa-pen" />{" "}
                          <FormattedMessage
                            id="app.page.form.card.action.edit"
                            defaultMessage={"Edit"}
                          />
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => this._showConfirmation(item.id)}
                        >
                          <Icon name="fas fa-trash" />{" "}
                          <FormattedMessage
                            id="app.page.form.card.action.delete"
                            defaultMessage={"Delete"}
                          />
                        </DropdownItem>
                      </DropdownItemGroup>
                    </Dropdown>
                  </span>
                  <h5
                    className="card-title text-truncate"
                    style={{ color: colors[random(0, 4)] }}
                  >
                    <Icon name="fas fa-file-alt" /> {item.name}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    <Icon name="fas fa-calendar text-muted" />{" "}
                    {moment(item.createdAt).format("ll")}
                  </h6>
                </CardHeader>
                <CardBody>
                  <Icon name="fas fa-database" />{" "}
                  {`${item._contentsMeta.count}`}{" "}
                  <FormattedMessage
                    id="app.page.form.card.text.responses"
                    defaultMessage={"responses"}
                  />{" "}
                  <Link decoration="underline" href={`#/form/${item.id}`}>
                    <FormattedMessage
                      id="app.page.form.card.action.view"
                      defaultMessage={"View data"}
                    />
                  </Link>
                </CardBody>
                <CardFooter>
                  <div className="text-right">
                    <CopyToClipboard
                      text={`${this.state.url}/${user.state.userName}/${
                        item.endpoint.split("/")[1]
                      }`}
                      style={{ cursor: "pointer" }}
                      onCopy={() =>
                        alert.success(
                          intl.formatMessage(messages.AlertFormSuccessCopied)
                        )
                      }
                    >
                      <Button className="btn btn-md btn-primary" primary>
                        <Icon name="fas fa-link" color="#FFF" />
                        <FormattedMessage
                          id="app.page.form.details.action.copy.endpoint"
                          defaultMessage={"Endpoint"}
                        />
                      </Button>
                    </CopyToClipboard>
                  </div>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </Fragment>
    );
  }
}

export default compose(
  withUser,
  injectIntl,
  withAlert,
  graphql(DELETE_FORM_MUTATION, { name: "deleteFormMutation" })
)(Cards);
