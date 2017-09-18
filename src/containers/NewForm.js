// @flow
import React, { PureComponent } from "react";
import { graphql, compose } from "react-apollo";
//Components
import CopyToClipboard from "react-copy-to-clipboard";
import AlertContainer from "react-alert";
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
} from "../components/atoms/index";
//Styles
import Colors from "../styles/Colors";
//Utils
import { _getUsername, guid, _getUserId } from "../services/utilities";
import { ALERT_OPTIONS } from "../services/Constants";
//API
import { CREATE_FORM_MUTATION } from "../api/Mutations";
import { ALL_FORMS_QUERY } from "../api/Queries";
const generateEndpoint = `api.formette.com/${_getUsername()}/`;

class NewForm extends PureComponent {
  msg: any;
  props: {
    createFormMutation: any,
    router: any
  };
  state = {
    name: "",
    description: "",
    customEndpoint: "",
    generateID:  guid(),
    disableForm: false,
    onModeEdit: false,
    error: false,
    errorMsg: "",
  };
  showAlert(
    type: string = "success",
    text: string = "Some Text",
    color: string = Colors.green,
    icon: string = "fa-link"
  ) {
    this.msg.show(text, {
      time: 3000,
      type,
      icon: <Icon name={icon} color={color} />
    });
  }
  _createForm = async () => {
    const {
      name,
      description,
      customEndpoint,
      disableForm: isDisabled,
      error,
      generateID
    } = this.state;
    //Verifies if the inputs are empty or not
    if (name) {
      if (error) return;
      const userId = _getUserId();
      let endpoint = customEndpoint
        ? `${_getUsername()}/${customEndpoint}`
        : `${_getUsername()}/${generateID}`;
      //saves the new form in the DB
        try{
             await this.props.createFormMutation({
                variables: {
                    userId,
                    name,
                    description,
                    endpoint,
                    isDisabled
                },
                update: (store, { data: {createForms} }) => {
                    try {
                        //reads the query from the cache
                        const data = store.readQuery({ query: ALL_FORMS_QUERY, variables: {userId: userId} });
                        //pushes the new data
                        data.allFormses.push(createForms);
                        //writes the new data to the store
                        store.writeQuery({ query: ALL_FORMS_QUERY, variables: {userId: userId}, data });
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
                //Shows feedback and updates the store
                //this.showAlert("success", "Form created successfully");
                this.props.history.push("/");
        }catch(e){
            console.error(e);
            this.setState({
                error: true,
                errorMsg: "This endpoint already exists, try another."
            });
        }
    } else {
      this.setState({
        error: true,
        errorMsg: "This form is feeling lonely, needs affection, needs data."
      });
    }
  };
  render() {
    const {
      name,
      description,
      customEndpoint,
      disableForm,
      onModeEdit,
      error,
      errorMsg,
      generateID
    } = this.state;
    return (
      <div>
        <AlertContainer ref={a => (this.msg = a)} {...ALERT_OPTIONS} />
        <div className="row">
          <div className={`col-md-${onModeEdit ? 9 : 12}`}>
            <SubTitle text="New form" color={Colors.text.secondary} />
            <Header text={name ? name : generateID} />
          </div>
          {onModeEdit
            ? <div className="col-md-3">
                <Badge
                  className="float-right"
                  text="Edit mode"
                  bg={Colors.yellow}
                />
              </div>
            : null}
        </div>
        <div className="row">
          <div className="col-md-6" style={{ marginTop: 30 }}>
            <form>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <SubTitle text="Name:" color={Colors.text.secondary} />
                <Input
                  placeholder="e.g: Newsletters"
                  value={name}
                  onChange={e =>
                    this.setState({ name: e.target.value, error: false })}
                  className="form-control"
                />
              </div>
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <SubTitle text="Description:" color={Colors.text.secondary} />
                <Textarea
                  className="form-control"
                  placeholder="e.g: This is a Newsletters form for my personal website."
                  value={description}
                  onChange={e =>
                    this.setState({
                      description: e.target.value,
                      error: false
                    })}
                  rows="3"
                />
              </div>
              <hr />
              <div className={`form-group ${error ? "has-danger" : ""}`}>
                <SubTitle
                  text="Custom endpoint:"
                  color={Colors.text.secondary}
                />
                <Text
                  text="You can choose a custom endpoint but note that the name has to be unique compared to your previously created forms."
                  color={Colors.text.secondary}
                />
                <Input
                  placeholder="e.g: newsletters2017"
                  value={customEndpoint}
                  onChange={e =>
                    this.setState({
                      customEndpoint: e.target.value,
                      error: false
                    })}
                  className="form-control"
                />
              </div>
              <Button
                color={Colors.primary}
                className="btn btn-lg btn-primary btn-block"
                onClick={this._createForm}
              >
                {onModeEdit ? "Update" : "Save"} form
              </Button>
              <br />
              {error ? <Text text={errorMsg} color={Colors.red} /> : ""}
            </form>
          </div>
          <div className="col-md-6" style={{ marginTop: 30 }}>
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <SubTitle text="Endpoint:" color={Colors.text.secondary} />
                  <div className="input-group">
                    <Input
                      placeholder={`${generateEndpoint}${customEndpoint
                        ? customEndpoint
                        : generateID}`}
                      className="form-control"
                      style={{ margin: 0 }}
                      readOnly
                    />
                    <CopyToClipboard
                      text={`${generateEndpoint}${customEndpoint
                        ? customEndpoint
                        : generateID}`}
                      style={{ cursor: "pointer" }}
                      onCopy={_ =>
                        this.showAlert(
                          "success",
                          "Endpoint copied to clipboard"
                        )}
                    >
                      <div className="input-group-addon">
                        <Icon name="fa-clipboard" size={16} />
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
                <hr />
                <div>
                  <SubTitle text="Sample:" color={Colors.text.secondary} />
                  <Text
                    text="Copy and paste the example of the form below into your project, change its content according to your needs."
                    color={Colors.text.secondary}
                  />
                  <SyntaxHighlighter language="javascript" style={docco}>
                    {'<form action="'+generateEndpoint+''+(customEndpoint ? customEndpoint : generateID)+'" method="post" target="_blank">\n' +
                      '  <input type="text" name="email" placeholder="Email" />\n' +
                      '  <input type="text" name="message" placeholder="Message" />\n' +
                      '  <button class="button" type="submit">Submit</button>\n' +
                      "</form>"}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
            <div className="card" style={{ marginTop: 10 }}>
              <div className="card-body">
                <SubTitle
                  text="Disable form submissions:"
                  color={Colors.text.secondary}
                />
                <Switch
                  onChange={value => this.setState({ disableForm: value })}
                  value={disableForm}
                />
                {onModeEdit
                  ? <div>
                      <hr />
                      <SubTitle
                        text="Settings:"
                        color={Colors.text.secondary}
                      />
                      <ul className="list-inline">
                        <li>
                          <Link color={Colors.red}>Delete form</Link>
                        </li>
                      </ul>
                    </div>
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const NewFormWithData = compose(
  graphql(CREATE_FORM_MUTATION, { name: "createFormMutation" })
)(NewForm);

export default NewFormWithData;
