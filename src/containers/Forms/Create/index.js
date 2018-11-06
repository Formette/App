// @flow
import React, { PureComponent } from "react";
import { graphql, compose, withApollo } from "react-apollo";
import Loadable from "react-loadable";
//Containers
import Tools from "../FormsList/Tools";
//Components
import CopyToClipboard from "react-copy-to-clipboard";
import { docco } from "react-syntax-highlighter/dist/styles";
import {
  SubTitle,
  Input,
  InputGroup,
  Button,
  Text,
  Textarea,
  Icon,
  Switch,
  Link
} from "../../../components/atoms";
import {
  Graphic,
  Confirmation,
  Card,
  HorizontalList,
  Loader
} from "../../../components/molecules";
//hocs
import { withUser } from "../../../hocs";
//Utils
import { guid } from "../../../services/utilities";
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
//locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";

const SyntaxHighlighter = Loadable({
  loader: () => import("react-syntax-highlighter"),
  loading() {
    return <Loader />;
  }
});

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
    customRedirect: "",
    generateEndpoint: `${process.env.REACT_APP_ENDPOINT_URL}`,
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
      customRedirect,
      disableForm: isDisabled,
      error,
      generateID,
      onModeEdit
    } = this.state;
    const { intl, user, createFormMutation, alert } = this.props;
    //Verifies if the inputs are empty or not
    if (name) {
      if (error) return;
      const userId = user.state.profile.id;
      const redirect = customRedirect || "https://formette.com/thanks";
      let endpoint = customEndpoint
        ? `${userId}/${customEndpoint}`
        : `${userId}/${generateID}`;
      //saves the new form in the DB
      try {
        //if is on mode edit only updates the form, does not create a new one
        if (onModeEdit) {
          this._updateForm(name, description, endpoint, isDisabled, redirect);
        } else {
          await createFormMutation({
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
          alert.success(intl.formatMessage(messages.AlertFormSuccessCreated));
          LogRocket.log("Form created successfully");
          LogRocket.track("Created Form");
          //redirects the user to the main page
          this.props.history.goBack();
        }
      } catch (e) {
        LogRocket.error({ CreateForm: e });
        this.setState({
          error: true,
          errorMsg: intl.formatMessage(messages.ErrorFormExists)
        });
      }
    } else {
      LogRocket.log("This form is feeling lonely, needs affection, needs data");
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.ErrorFormEmpty)
      });
    }
  };
  _updateForm = async (
    name: string,
    description: string,
    endpoint: string,
    isDisabled: boolean,
    redirect: string
  ) => {
    const { intl, match, updateFormMutation, alert } = this.props;
    try {
      const id = match.params.id;
      const { oldData } = this.state;
      //checks if the new data is the same as the previous
      if (
        name === oldData.name &&
        description === oldData.description &&
        endpoint === oldData.endpoint &&
        isDisabled === oldData.isDisabled &&
        redirect === oldData.redirect
      ) {
        LogRocket.log(
          "If it's the same as before, what's the point of changing?"
        );
        this.setState({
          error: true,
          errorMsg: intl.formatMessage(messages.ErrorFormSame)
        });
        return;
      }
      //updates the form in the DB
      await updateFormMutation({
        variables: {
          id,
          name,
          description,
          endpoint,
          isDisabled,
          redirect
        }
      });
      //Shows feedback and updates the store
      alert.success(intl.formatMessage(messages.AlertFormSuccessUpdated));
      LogRocket.log("Form updated successfully");
      LogRocket.track("Updated Form");
      //redirects the user to the main page
      this.props.history.goBack();
    } catch (e) {
      LogRocket.error({ UpdateForm: e });
      this.setState({
        error: true,
        errorMsg: intl.formatMessage(messages.ErrorFormExists)
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
    const { intl, match, user, alert } = this.props;
    const { id } = match.params;
    const userId = user.state.profile.id;
    const response = deleteForm(id, userId, this.props.deleteFormMutation);
    if (response) {
      //Shows feedback and updates the store
      alert.success(intl.formatMessage(messages.AlertFormSuccessDeleted));
      LogRocket.log("Form deleted successfully");
      LogRocket.track("Deleted Form");
      //redirects the user to the main page
      this.props.history.push("/");
    } else {
      LogRocket.error(
        "What a disgrace but it was not possible to delete the form, try again."
      );
      alert.error(intl.formatMessage(messages.AlertFormErrorDelete));
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
            isDisabled: disableForm,
            redirect: customRedirect
          } = res.data.Forms;
          const point = endpoint.split("/");
          this.setState(prevState => ({
            name,
            description,
            disableForm,
            customEndpoint: point[1],
            customRedirect,
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
      customRedirect,
      generateEndpoint,
      disableForm,
      onModeEdit,
      error,
      errorMsg,
      generateID,
      nullFormToEdit,
      onConfirmation
    } = this.state;
    const { userName } = this.props.user.state;
    const { intl, alert } = this.props;

    if (nullFormToEdit) {
      return (
        <Graphic
          title={intl.formatMessage(messages.GraphicFormErrorTitle)}
          description={intl.formatMessage(messages.GraphicFormErrorDescription)}
          imgType="empty"
        >
          <Button
            className="btn btn-lg btn-primary"
            onClick={() => this.props.history.push("/")}
            primary
          >
            <FormattedMessage
              id="app.graphic.form.edit.error.action"
              defaultMessage={"Go back"}
            />
          </Button>
        </Graphic>
      );
    }

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
          title={name ? name : generateID}
          description={intl.formatMessage(messages.PageFormCreateDescription)}
          titleTruncate
          textTruncate
        >
          <div
            className="col-sm-auto col-md-6"
            style={{ marginBottom: "20px" }}
          >
            <InputGroup
              InputProps={{
                type: "text",
                className: "form-control",
                placeholder: `${generateEndpoint}/${userName}/${
                  customEndpoint ? customEndpoint : generateID
                }`,
                readOnly: true
              }}
              IconProps={{ name: "fas fa-link" }}
            />
          </div>
          <div className="col-sm-auto col-md-6">
            <HorizontalList>
              <li>
                <CopyToClipboard
                  text={`${generateEndpoint}/${userName}/${
                    customEndpoint ? customEndpoint : generateID
                  }`}
                  style={{ cursor: "pointer" }}
                  onCopy={() =>
                    alert.success(
                      intl.formatMessage(messages.AlertFormSuccessCopied)
                    )
                  }
                >
                  <Button className="btn btn-lg">
                    <Icon name="fas fa-clipboard" />
                  </Button>
                </CopyToClipboard>
              </li>
              <li>
                <Button
                  className="btn btn-lg align-right"
                  onClick={this._createForm}
                  primary
                >
                  <Icon name="fas fa-save" color="#FFF" />{" "}
                  {onModeEdit ? (
                    <FormattedMessage
                      id="app.page.form.create.action.update"
                      defaultMessage={"Update"}
                    />
                  ) : (
                    <FormattedMessage
                      id="app.page.form.create.action.save"
                      defaultMessage={"Save"}
                    />
                  )}
                  <FormattedMessage
                    id="app.page.form.create.action.title"
                    defaultMessage={"form"}
                  />
                </Button>
              </li>
            </HorizontalList>
          </div>
        </Tools>

        <div className="row">
          <div className="col-md-6" style={{ marginTop: 30 }}>
            <form>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <Text highlight>
                  <FormattedMessage
                    id="app.page.form.create.text.name"
                    defaultMessage={"Name"}
                  />
                </Text>
                <Input
                  placeholder={intl.formatMessage(
                    messages.PageFormCreateTextNamePlaceholder
                  )}
                  value={name}
                  onChange={e =>
                    this.setState({ name: e.target.value, error: false })
                  }
                  className={`form-control ${error && "is-invalid"}`}
                  invalid
                />
                {error && <Text danger>{errorMsg}</Text>}
              </div>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <Text highlight>
                  <FormattedMessage
                    id="app.page.form.create.text.description"
                    defaultMessage={"Description"}
                  />
                </Text>
                <Textarea
                  className="form-control"
                  placeholder={intl.formatMessage(
                    messages.PageFormCreateTextDescriptionPlaceholder
                  )}
                  value={description}
                  onChange={e =>
                    this.setState({
                      description: e.target.value
                    })
                  }
                  rows="3"
                />
              </div>

              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <Text highlight>
                  <FormattedMessage
                    id="app.page.form.create.text.custom.endpoint"
                    defaultMessage={"Custom endpoint"}
                  />
                </Text>
                <Text>
                  <FormattedMessage
                    id="app.page.form.create.text.custom.endpoint.description"
                    defaultMessage={
                      "You can choose a custom endpoint but note that the name has to be unique compared to your previously created forms."
                    }
                  />
                </Text>
                <Input
                  placeholder={intl.formatMessage(
                    messages.PageFormCreateTextEndpointPlaceholder
                  )}
                  value={customEndpoint}
                  onChange={e =>
                    this.setState({
                      customEndpoint: e.target.value
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <Text highlight>
                  <FormattedMessage
                    id="app.page.form.create.text.custom.redirect"
                    defaultMessage={"Custom redirect"}
                  />
                </Text>
                <Text>
                  <FormattedMessage
                    id="app.page.form.create.text.custom.redirect.description"
                    defaultMessage={
                      "You can choose a custom redirect when your form is submitted, this url can be a page to thank the user or even to take the users to a page of your site."
                    }
                  />
                </Text>
                <Input
                  placeholder={intl.formatMessage(
                    messages.PageFormCreateTextRedirectlaceholder
                  )}
                  value={customRedirect}
                  onChange={e =>
                    this.setState({
                      customRedirect: e.target.value
                    })
                  }
                  className="form-control"
                />
              </div>
            </form>
          </div>
          <div className="col-md-6" style={{ marginTop: 30 }}>
            <Card>
              <div className="card-body">
                <div>
                  <Text highlight>
                    <FormattedMessage
                      id="app.page.form.create.text.sample"
                      defaultMessage={"Sample:"}
                    />
                  </Text>
                  <Text>
                    <FormattedMessage
                      id="app.page.form.create.text.sample.description"
                      defaultMessage={
                        "Copy and paste the example of the form below into your project, change its content according to your needs."
                      }
                    />
                  </Text>
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {'<form action="' +
                      generateEndpoint +
                      `/${userName}/` +
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
            <Card style={{ marginTop: 10, marginBottom: 10 }}>
              <div className="card-body">
                <Text highlight>
                  <FormattedMessage
                    id="app.page.form.create.text.disable"
                    defaultMessage={"Disable form submissions:"}
                  />
                </Text>
                <Switch
                  onChange={value => {
                    this.setState({ disableForm: value });
                  }}
                  value={disableForm}
                />
                {onModeEdit ? (
                  <div>
                    <hr />
                    <SubTitle>
                      {" "}
                      <FormattedMessage
                        id="app.page.form.create.text.settings"
                        defaultMessage={"Settings:"}
                      />
                    </SubTitle>
                    <ul className="list-inline">
                      <li>
                        <Link color="red" onClick={this._showConfirmation}>
                          <FormattedMessage
                            id="app.page.form.create.action.delete"
                            defaultMessage={"Delete form"}
                          />
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
  withUser,
  injectIntl,
  withAlert,
  graphql(CREATE_FORM_MUTATION, { name: "createFormMutation" }),
  graphql(UPDATE_FORM_MUTATION, { name: "updateFormMutation" }),
  graphql(DELETE_FORM_MUTATION, { name: "deleteFormMutation" })
)(NewForm);

export default withApollo(newFormWithData);
