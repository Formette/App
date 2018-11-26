import React, { PureComponent } from "react";
import PropTypes from "prop-types";
//Apollo
import { compose, graphql } from "react-apollo";
//Components
import { Text, Button, Icon, Input, Switch } from "../../../components/atoms";
import { Card, CardBody, CardFooter } from "../../../components/molecules";
//API
import { ENABLE_OR_UPDATE_FORM_HONEY_POT_MUTATION } from "../../../api/Mutations";
//locales
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";

class Security extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    formId: PropTypes.string,
    enableHoney: PropTypes.bool.isRequired,
    honeyField: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      enableHoney: props.enableHoney || false,
      honeyField: props.honeyField || null
    };
  }
  render() {
    const { intl } = this.props;
    const { enableHoney, honeyField } = this.state;
    console.log(this.props);
    return (
      <div className="row">
        <div className="col-md-4">
          <Card style={{ marginBottom: "30px" }}>
            <div className="card-body">
              <div>
                <Text highlight>
                  <FormattedMessage
                    id="app.page.form.details.security.honey.title"
                    defaultMessage={"Honey Pot"}
                  />
                </Text>
                <Text>
                  <FormattedMessage
                    id="app.page.form.details.security.honey.description"
                    defaultMessage={
                      "Honey Pot is a pattern and by adding an invisible field to your forms that only spam robots can see. With this pattern, we can avoid spam, we do this by checking in the submission if the field has value or not."
                    }
                  />
                </Text>
                <Switch
                  onChange={value => {
                    this.setState({ enableHoney: value });
                  }}
                  value={enableHoney}
                />
              </div>
            </div>
            <CardBody>
              <Input
                placeholder={intl.formatMessage(
                  messages.PageFormSecurityHoneyInput
                )}
                value={honeyField}
                onChange={e => this.setState({ honeyField: e.target.value })}
                className={`form-control`}
                disabled={!enableHoney}
              />
            </CardBody>
            <CardFooter>
              <div className="text-right">
                <Button className="btn btn-md btn-primary" primary>
                  <Icon name="fas fa-save" color="#FFF" />
                  <FormattedMessage
                    id="app.page.form.details.security.action.text"
                    defaultMessage={"Save"}
                  />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  graphql(ENABLE_OR_UPDATE_FORM_HONEY_POT_MUTATION, {
    name: "updateHoneyMutation"
  })
)(Security);
