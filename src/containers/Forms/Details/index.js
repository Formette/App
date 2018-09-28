// @flow
import React, { PureComponent } from "react";
import { graphql, compose } from "react-apollo";
import * as moment from "moment";
//Components
import CopyToClipboard from "react-copy-to-clipboard";
import {
  SubTitle,
  Header,
  Button,
  Icon
} from "../../../components/atoms/index";
import {
  HorizontalList,
  Table,
  Graphic,
  Confirmation
} from "../../../components/molecules/index";
//Styles
import Colors from "../../../styles/Colors";
//Utils
import {
  _getUsername,
  _refreshPage,
  _getUserId
} from "../../../services/utilities";
import LogRocket from "logrocket";
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
    showMessage: () => mixed,
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
      this.props.showMessage(
        "success",
        "Form deleted successfully",
        undefined,
        "fa-trash"
      );
      LogRocket.info("Form deleted successfully");
      LogRocket.track("Deleted Form");
      //redirects the user to the main page
      this.props.history.push("/");
    } else {
      LogRocket.warn(
        "What a disgrace but it was not possible to delete the form, try again."
      );
      this.props.showMessage(
        "error",
        "What a disgrace but it was not possible to delete the form, try again.",
        Colors.red,
        "fa-exclamation-triangle"
      );
    }
  };
  _editForm = () => {
    this.props.history.push(`/edit/${this.props.match.params.id}`);
  };
  _organizeTableData = content => {
    let data = [];
    let items = [];
    content.map(value => {
      items = {
        ...value.data[0],
        createdAt: moment(value.createdAt).format("ll")
      };
      data.push(items);
      return true;
    });
    return data;
  };
  render() {
    if (this.props.formDataQuery && this.props.formDataQuery.loading) {
      return <div>Loading</div>;
    }
    if (this.props.formDataQuery && this.props.formDataQuery.error) {
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
    if (this.props.formDataQuery.Forms === null) {
      return (
        <Graphic
          text="Hello Indiana Jones, are you in unfamiliar lands? You are a great explorer but this form does
                              not exist and may contain mysterious dangers. Come back home."
        >
          <Button
            className="btn btn-lg btn-primary"
            color={Colors.primary}
            onClick={() => this.props.history.push("/")}
          >
            Go back home
          </Button>
        </Graphic>
      );
    }
    const { name, endpoint, contents } = this.props.formDataQuery.Forms;
    const items = this._organizeTableData(contents);
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
        />
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <SubTitle color={Colors.text.secondary} >All the data for</SubTitle>
            <Header className="text-truncate">{name}</Header>
          </div>
          <div className="col-md-6 col-sm-12">
            <HorizontalList className="float-right">
              <li>
                <CopyToClipboard
                  text={`${url}${point[1]}`}
                  style={{ cursor: "pointer" }}
                  onCopy={() =>
                    this.props.showMessage(
                      "success",
                      "Endpoint copied to clipboard",
                      undefined,
                      undefined
                    )
                  }
                >
                  <Button
                    className="btn"
                    color={Colors.default}
                    textColor={Colors.white}
                  >
                    <Icon color={Colors.white} name="fa-link" />
                    <span>Endpoint</span>
                  </Button>
                </CopyToClipboard>
              </li>
              <li>
                <Button
                  className="btn"
                  color={Colors.default}
                  textColor={Colors.white}
                  onClick={this._editForm}
                >
                  <Icon color={Colors.white} name="fa-pencil" />
                  <span>Edit</span>
                </Button>
              </li>
              <li>
                <Button
                  className="btn"
                  color={Colors.red}
                  textColor={Colors.white}
                  onClick={this._showConfirmation}
                >
                  <Icon color={Colors.white} name="fa-trash-o" />
                  <span>Delete</span>
                </Button>
              </li>
            </HorizontalList>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                {Object.keys(items).length === 0 ? (
                  <div>
                    This form is so sad ... You do not have any submissions yet,
                    help it, go! Look for data for this poor guy.
                  </div>
                ) : (
                  <Table data={items} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const formDetailsWithData = compose(
  graphql(FORM_DATA_QUERY, {
    name: "formDataQuery",
    options: props => ({
      variables: { id: props.match.params.id }
    })
  }),
  graphql(DELETE_FORM_MUTATION, { name: "deleteFormMutation" })
)(FormDetails);

export default formDetailsWithData;
