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

const colors = ["#7568F0", "#8A75F3", "#A384F6", "#A384F6", "#CA9CFB"];
class Cards extends PureComponent {
  state = {
    url: `${process.env.REACT_APP_ENDPOINT_URL}`,
    onConfirmation: false,
    formId: null
  };
  _onDeleteForm = async () => {
    //deletes the form in the DB
    const { formId: id } = this.state;
    const userId = this.props.user.state.profile.id;
    const response = deleteForm(id, userId, this.props.deleteFormMutation);
    if (response) {
      //Shows feedback and updates the store
      this.props.alert.success("Form deleted successfully");
      LogRocket.info("Form deleted successfully from form list");
      LogRocket.track("Deleted Form");
      this.setState({ onConfirmation: false, formId: null });
    } else {
      LogRocket.warn(
        "What a disgrace but it was not possible to delete the form, try again."
      );
      this.props.alert.error(
        "It was not possible to delete the form, try again."
      );
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
    const { data, alert, user } = this.props;
    const { onConfirmation } = this.state;
    if (Object.keys(data).length === 0) {
      return (
        <Graphic
          title="No search results"
          description="No form was found with the words in the search box. Try searching in other words."
          imgType="notfound"
          top={55}
        />
      );
    }
    return (
      <Fragment>
        <Confirmation
          title="Are you sure?"
          description="Are you sure you want to delete this form?"
          show={onConfirmation}
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
                          <Icon name="fas fa-pen" /> Edit
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => this._showConfirmation(item.id)}
                        >
                          <Icon name="fas fa-trash" /> Delete
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
                  {`${item._contentsMeta.count}`} reponses{" "}
                  <Link decoration="underline" href={`#/form/${item.id}`}>
                    View data
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
                        alert.success("Endpoint copied to clipboard")
                      }
                    >
                      <Button className="btn btn-md btn-primary" primary>
                        <Icon name="fas fa-link" color="#FFF" /> Endpoint
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
  withAlert,
  graphql(DELETE_FORM_MUTATION, { name: "deleteFormMutation" })
)(Cards);
