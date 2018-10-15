// @flow
import React, { PureComponent } from "react";
import { graphql, compose } from "react-apollo";
//Containers
import Tools from "../FormsList/Tools";
import Table from "./Table";
//Components
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Icon } from "../../../components/atoms/index";
import {
  Card,
  HorizontalList,
  Graphic,
  Confirmation,
  Loader
} from "../../../components/molecules/index";
//Utils
import {
  _getUsername,
  _refreshPage,
  _getUserId
} from "../../../services/utilities";
import LogRocket from "logrocket";
import { withAlert } from "react-alert";
//API
import { FORM_DATA_QUERY } from "../../../api/Queries";
import { DELETE_FORM_MUTATION } from "../../../api/Mutations";
import { FORM_DATA_SUBSCRIPTION } from "../../../api/Subscriptions";
import { deleteForm } from "../../../api/Functions";

export class FormDetails extends PureComponent {
  state = {
    onConfirmation: false,
    url: `https://api.formette.com/${_getUsername()}/`
  };
  props: {
    formDataQuery: any,
    deleteFormMutation: any,
    history: any,
    match: any
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
    const { id } = this.props.match.params;
    const userId = _getUserId();
    const response = deleteForm(id, userId, this.props.deleteFormMutation);
    if (response) {
      //Shows feedback and updates the store
      this.props.alert.success("Form deleted successfully");
      LogRocket.info("Form deleted successfully");
      LogRocket.track("Deleted Form");
      //redirects the user to the main page
      this.props.history.push("/");
    } else {
      LogRocket.warn(
        "What a disgrace but it was not possible to delete the form, try again."
      );
      this.props.alert.error(
        "What a disgrace but it was not possible to delete the form, try again."
      );
    }
  };
  _editForm = () => {
    this.props.history.push(`/edit/${this.props.match.params.id}`);
  };
  render() {
    if (this.props.formDataQuery && this.props.formDataQuery.loading) {
      return <Loader />;
    }
    if (this.props.formDataQuery && this.props.formDataQuery.error) {
      return (
        <Graphic
          title="Error..."
          description="Ups! Something went wrong try again."
          icon="error"
        >
          <Button
            className="btn btn-lg btn-primary"
            onClick={_refreshPage}
            primary
          >
            Try Again
          </Button>
        </Graphic>
      );
    }
    if (this.props.formDataQuery.Forms === null) {
      return (
        <Graphic
          title="No data to show"
          description="Hello Indiana Jones, are you in unfamiliar lands? You are a great explorer but this form does
                              not exist and may contain mysterious dangers. Come back home."
          imgType="empty"
          top={200}
        >
          <Button
            className="btn btn-lg btn-primary"
            onClick={() => this.props.history.push("/")}
            primary
          >
            Go back home
          </Button>
        </Graphic>
      );
    }
    const {
      name,
      description,
      endpoint,
      contents
    } = this.props.formDataQuery.Forms;
    const point = endpoint.split("/");
    const { onConfirmation, url } = this.state;
    return (
      <div>
        <Confirmation
          title="Are you sure?"
          description="Are you sure you want to delete this form?"
          show={onConfirmation}
          onCancel={this._showConfirmation}
          onConfirmation={this._onDeleteForm}
          actionProps={{ danger: true }}
        />
        <Tools
          title={name}
          description={description || "This form has no description"}
          titleTruncate
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
                  text={`${url}${point[1]}`}
                  style={{ cursor: "pointer" }}
                  onCopy={() =>
                    this.props.alert.success("Endpoint copied to clipboard.")
                  }
                >
                  <Button className="btn btn-lg" primary>
                    <Icon name="fas fa-link" />
                    <span>Endpoint</span>
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
                <Table data={contents} />
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
  graphql(FORM_DATA_QUERY, {
    name: "formDataQuery",
    options: props => ({
      variables: { id: props.match.params.id }
    })
  }),
  graphql(DELETE_FORM_MUTATION, { name: "deleteFormMutation" })
)(FormDetails);
