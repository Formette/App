// @flow
import React, { PureComponent } from "react";
import { graphql, compose, withApollo } from "react-apollo";
//Components
import CopyToClipboard from "react-copy-to-clipboard";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/styles";
import {
  SubTitle,
  Header,
  Input,
  Button,
  Text,
  Textarea,
  Icon,
  Switch,
  Link,
  Badge
} from "../../../components/atoms/index";
import {
  Graphic,
  Confirmation,
  Card
} from "../../../components/molecules/index";
//Utils
import { _getUsername, guid, _getUserId } from "../../../services/utilities";
import LogRocket from "logrocket";
import { withAlert } from "react-alert";
//API
import {
  CREATE_FORM_MUTATION,
  UPDATE_FORM_MUTATION,
  DELETE_FORM_MUTATION
} from "../../../api/Mutations";
import { ALL_FORMS_QUERY, FORM_DATA_QUERY } from "../../../api/Queries";
import { deleteForm } from "../../../api/Functions";

export class NewForm extends PureComponent {
  props: {
    createFormMutation: any,
    updateFormMutation: any,
    deleteFormMutation: any,
    router: any,
    history: any,
    match: any,
    client: any
  };
  state = {
    name: "",
    description: "",
    customEndpoint: "",
    generateEndpoint: `https://api.formette.com/${_getUsername()}/`,
    generateID: guid(),
    disableForm: false,
    oldData: [],
    onModeEdit: false,
    error: false,
    errorMsg: "",
    nullFormToEdit: false,
    onConfirmation: false
  };
  componentDidMount() {
    //if the form is already created set the edit mode
    if (this.props.match.params.id !== undefined) {
      this._getFormData(this.props.match.params.id);
    }
  }
  _createForm = async () => {
    const {
      name,
      description,
      customEndpoint,
      disableForm: isDisabled,
      error,
      generateID,
      onModeEdit
    } = this.state;
    //Verifies if the inputs are empty or not
    if (name) {
      if (error) return;
      const userId = _getUserId();
      let endpoint = customEndpoint
        ? `${userId}/${customEndpoint}`
        : `${userId}/${generateID}`;
      //saves the new form in the DB
      try {
        //if is on mode edit only updates the form, does not create a new one
        if (onModeEdit) {
          this._updateForm(name, description, endpoint, isDisabled);
        } else {
          await this.props.createFormMutation({
            variables: {
              userId,
              name,
              description,
              endpoint,
              isDisabled
            },
            update: (store, { data: { createForms } }) => {
              try {
                //reads the query from the cache
                const data = store.readQuery({
                  query: ALL_FORMS_QUERY,
                  variables: { userId }
                });
                //pushes the new data
                data.allFormses.push(createForms);
                //writes the new data to the store
                store.writeQuery({
                  query: ALL_FORMS_QUERY,
                  variables: { userId },
                  data
                });
              } catch (e) {
                LogRocket.error({ UpdateForm: e });
              }
            }
          });
          //Shows feedback and updates the store
          this.props.alert.success("Form created successfully");
          LogRocket.log("Form created successfully");
          LogRocket.track("Created Form");
          //redirects the user to the main page
          this.props.history.push("/");
        }
      } catch (e) {
        LogRocket.error({ CreateForm: e });
        this.setState({
          error: true,
          errorMsg: "This endpoint already exists, try another."
        });
      }
    } else {
      LogRocket.log("This form is feeling lonely, needs affection, needs data");
      this.setState({
        error: true,
        errorMsg: "This form is feeling lonely, needs affection, needs data."
      });
    }
  };
  _updateForm = async (
    name: string,
    description: string,
    endpoint: string,
    isDisabled: boolean
  ) => {
    try {
      const id = this.props.match.params.id;
      const { oldData } = this.state;
      //checks if the new data is the same as the previous
      if (
        name === oldData.name &&
        description === oldData.description &&
        endpoint === oldData.endpoint &&
        isDisabled === oldData.isDisabled
      ) {
        LogRocket.log(
          "If it's the same as before, what's the point of changing?"
        );
        this.setState({
          error: true,
          errorMsg: "If it's the same as before, what's the point of changing?"
        });
        return;
      }
      //updates the form in the DB
      await this.props.updateFormMutation({
        variables: {
          id,
          name,
          description,
          endpoint,
          isDisabled
        }
      });
      //Shows feedback and updates the store
      this.props.alert.success("Form updated successfully");
      LogRocket.log("Form updated successfully");
      LogRocket.track("Updated Form");
      //redirects the user to the main page
      this.props.history.push("/");
    } catch (e) {
      LogRocket.error({ UpdateForm: e });
      this.setState({
        error: true,
        errorMsg: "This endpoint already exists, try another."
      });
    }
  };
  _showConfirmation = () => {
    this.setState(prevState => ({
      onConfirmation: !prevState.onConfirmation
    }));
    LogRocket.track("Opened delete modal on Form Details");
  };
  _onDeleteForm = () => {
    //deletes the form in the DB
    const { id } = this.props.match.params;
    const userId = _getUserId();
    const response = deleteForm(id, userId, this.props.deleteFormMutation);
    if (response) {
      //Shows feedback and updates the store
      this.props.alert.success("Form deleted successfully");
      LogRocket.log("Form deleted successfully");
      LogRocket.track("Deleted Form");
      //redirects the user to the main page
      this.props.history.push("/");
    } else {
      LogRocket.error(
        "What a disgrace but it was not possible to delete the form, try again."
      );
      this.props.alert.error(
        "What a disgrace but it was not possible to delete the form, try again."
      );
    }
  };
  _getFormData = (id: string) => {
    this.props.client
      .query({
        query: FORM_DATA_QUERY,
        variables: { id }
      })
      .then(res => {
        //TODO do this condition in a better way
        if (res.data.Forms === null) {
          this.setState({ nullFormToEdit: true, onModeEdit: false });
          return true;
        }
        if (Object.keys(res.data.Forms).length !== 0) {
          const {
            name,
            endpoint,
            description,
            isDisabled: disableForm
          } = res.data.Forms;
          const point = endpoint.split("/");
          this.setState(prevState => ({
            name,
            description,
            disableForm,
            customEndpoint: point[1],
            onModeEdit: !prevState.onModeEdit,
            oldData: res.data.Forms
          }));
        } else {
          this.setState({ nullFormToEdit: true, onModeEdit: false });
        }
      })
      .catch(e => {
        LogRocket.error({ getFormData: e });
        this.setState({
          nullFormToEdit: true
        });
      });
  };
  render() {
    const {
      name,
      description,
      customEndpoint,
      generateEndpoint,
      disableForm,
      onModeEdit,
      error,
      errorMsg,
      generateID,
      nullFormToEdit,
      onConfirmation
    } = this.state;

    if (nullFormToEdit) {
      return (
        <Graphic
          title="Where is the form?"
          description="Ups! No form was found to edit."
          imgType="empty"
        >
          <Button
            className="btn btn-lg btn-primary"
            onClick={() => this.props.history.push("/")}
            primary
          >
            Go back
          </Button>
        </Graphic>
      );
    }

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
          <div className={`col-md-${onModeEdit ? 9 : 12}`}>
            <SubTitle>{`${onModeEdit ? "Edit" : "New"} Form`}</SubTitle>

            <Header>{name ? name : generateID}</Header>
          </div>
          {onModeEdit ? (
            <div className="col-md-3">
              <Badge className="float-right" text="Edit mode" />
            </div>
          ) : null}
        </div>
        <div className="row">
          <div className="col-md-6" style={{ marginTop: 30 }}>
            <form>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <SubTitle>Name:</SubTitle>
                <Input
                  placeholder="e.g: Newsletters"
                  value={name}
                  onChange={e =>
                    this.setState({ name: e.target.value, error: false })
                  }
                  className="form-control"
                />
              </div>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <SubTitle>Description:</SubTitle>
                <Textarea
                  className="form-control"
                  placeholder="e.g: This is a Newsletters form for my personal website."
                  value={description}
                  onChange={e =>
                    this.setState({
                      description: e.target.value,
                      error: false
                    })
                  }
                  rows="3"
                />
              </div>
              <hr />
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <SubTitle>Custom endpoint:</SubTitle>
                <Text>
                  You can choose a custom endpoint but note that the name has to
                  be unique compared to your previously created forms.
                </Text>
                <Input
                  placeholder="e.g: newsletters2017"
                  value={customEndpoint}
                  onChange={e =>
                    this.setState({
                      customEndpoint: e.target.value,
                      error: false
                    })
                  }
                  className="form-control"
                />
              </div>
              <Button
                className="btn btn-lg btn-primary btn-block"
                onClick={this._createForm}
                primary
              >
                {onModeEdit ? "Update" : "Save"} form
              </Button>
              <br />
              {error ? <Text color="red">{errorMsg}</Text> : ""}
            </form>
          </div>
          <div className="col-md-6" style={{ marginTop: 30 }}>
            <Card>
              <div className="card-body">
                <div className="form-group">
                  <SubTitle>Endpoint:</SubTitle>
                  <div className="input-group">
                    <Input
                      placeholder={`${generateEndpoint}${
                        customEndpoint ? customEndpoint : generateID
                      }`}
                      className="form-control"
                      style={{ margin: 0 }}
                      readOnly
                    />
                    <CopyToClipboard
                      text={`${generateEndpoint}${
                        customEndpoint ? customEndpoint : generateID
                      }`}
                      style={{ cursor: "pointer" }}
                      onCopy={() =>
                        this.props.alert.success(
                          "Endpoint copied to clipboard."
                        )
                      }
                    >
                      <div className="input-group-addon">
                        <Icon name="fas fa-clipboard" size={16} />
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
                <hr />
                <div>
                  <SubTitle>Sample:</SubTitle>
                  <Text>
                    Copy and paste the example of the form below into your
                    project, change its content according to your needs.
                  </Text>
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {'<form action="' +
                      generateEndpoint +
                      "" +
                      (customEndpoint ? customEndpoint : generateID) +
                      '" method="post" target="_blank">\n' +
                      '  <input type="text" name="email" placeholder="Email" />\n' +
                      '  <input type="text" name="message" placeholder="Message" />\n' +
                      '  <button class="button" type="submit">Submit</button>\n' +
                      "</form>"}
                  </SyntaxHighlighter>
                </div>
              </div>
            </Card>
            <Card style={{ marginTop: 10 }}>
              <div className="card-body">
                <SubTitle>Disable form submissions:</SubTitle>
                <Switch
                  onChange={value => {
                    this.setState({ disableForm: value });
                  }}
                  value={disableForm}
                />
                {onModeEdit ? (
                  <div>
                    <hr />
                    <SubTitle>Settings:</SubTitle>
                    <ul className="list-inline">
                      <li>
                        <Link color="red" onClick={this._showConfirmation}>
                          Delete form
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

const newFormWithData = compose(
  withAlert,
  graphql(CREATE_FORM_MUTATION, { name: "createFormMutation" }),
  graphql(UPDATE_FORM_MUTATION, { name: "updateFormMutation" }),
  graphql(DELETE_FORM_MUTATION, { name: "deleteFormMutation" })
)(NewForm);

export default withApollo(newFormWithData);
