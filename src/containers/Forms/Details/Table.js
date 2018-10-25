import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
//Components
import DynamicTable from "@atlaskit/dynamic-table";
import { Icon, Link } from "../../../components/atoms";
import { Graphic } from "../../../components/molecules";
import Dropdown, {
  DropdownItemGroup,
  DropdownItem
} from "@atlaskit/dropdown-menu";
//Utils
// eslint-disable-next-line
import * as moment from "moment";
import { withAlert } from "react-alert";
import { _capitalizeFirstLetter } from "../../../services/utilities";
import { FormattedMessage, injectIntl } from "react-intl";
import { globals as messages } from "../../../locales/api";
import LogRocket from "logrocket";
//API
import { DELETE_FORM_CONTENT_MUTATION } from "../../../api/Mutations";
import { deleteFormContent } from "../../../api/Functions";

class Table extends Component {
  state = {
    isLoading: true
  };
  _onCreateHead = () => {
    try {
      const { data: content } = this.props;
      const cells = [];

      const keys = Object.keys(content[0].data[0]);
      const dateKey = Object.keys(content[0]);

      keys.map(item => {
        if (item !== "__typename") {
          cells.push({
            key: item,
            content: _capitalizeFirstLetter(item),
            isSortable: false,
            shouldTruncate: true,
            width: undefined
          });
        }
        return true;
      });

      cells.push(
        {
          key: dateKey[2],
          content: _capitalizeFirstLetter(dateKey[2])
        },
        {
          key: "actions",
          content: "Actions"
        }
      );
      return { cells: [...cells] };
    } catch (error) {
      LogRocket.error({ _onCreateHead: error });
      this.props.alert.error(
        this.props.intl.formatMessage(messages.GraphicErrorDescription)
      );
    }
  };
  _onGenerate = data => {
    const result = [];
    for (let [key, value] of Object.entries(data)) {
      result.push({
        key: key,
        content: value
      });
    }
    return result;
  };
  _onGenerateActions = id => {
    return (
      <Dropdown
        trigger={
          <Link className="text-muted">
            <Icon name="fas fa-ellipsis-h" />
          </Link>
        }
        isMenuFixed={true}
        position="bottom right"
      >
        <DropdownItemGroup
          title={this.props.intl.formatMessage(messages.PageFormCardActions)}
        >
          <DropdownItem href={`#/form/content/${id}`}>
            <Icon name="fas fa-eye" />{" "}
            <FormattedMessage
              id="app.page.form.card.action.view.content"
              defaultMessage={"View"}
            />
          </DropdownItem>
          <DropdownItem onClick={() => this._onDeleteContent(id)}>
            <Icon name="fas fa-trash" />{" "}
            <FormattedMessage
              id="app.page.form.card.action.delete"
              defaultMessage={"Delete"}
            />
          </DropdownItem>
        </DropdownItemGroup>
      </Dropdown>
    );
  };
  _onDeleteContent = id => {
    const { deleteFormContentMutation, formId, intl, alert } = this.props;
    const response = deleteFormContent(id, formId, deleteFormContentMutation);
    if (response) {
      //Shows feedback and updates the store
      alert.success(
        intl.formatMessage(messages.AlertFormContentSuccessDeleted)
      );
      LogRocket.info("Content deleted successfully");
      LogRocket.track("Deleted Form Content");
    } else {
      LogRocket.error("Error on deleting form content");
      alert.error(intl.formatMessage(messages.GraphicErrorDescription));
    }
  };
  _onCreateRows = () => {
    try {
      const { data } = this.props;
      const rows = [];
      data.map((res, index) => {
        let createdAt = moment(res.createdAt).format("ll");
        let actions = this._onGenerateActions(res.id);
        rows.push({
          key: `row-${index}-${res.id}`,
          cells: this._onGenerate({ ...res.data[0], createdAt, actions })
        });
        return true;
      });
      return rows;
    } catch (error) {
      LogRocket.error({ _onCreateRows: error });
      this.props.alert.error(
        this.props.intl.formatMessage(messages.GraphicErrorDescription)
      );
    }
  };
  render() {
    const { data, emptyText, emptyDescription } = this.props;
    if (Object.keys(data).length === 0) {
      return (
        <Graphic
          title={emptyText}
          description={emptyDescription}
          imgType="data"
        />
      );
    }
    return (
      <DynamicTable
        head={this._onCreateHead()}
        rows={this._onCreateRows()}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={false}
        isFixedSize
      />
    );
  }
}

export default compose(
  withAlert,
  injectIntl,
  graphql(DELETE_FORM_CONTENT_MUTATION, { name: "deleteFormContentMutation" })
)(Table);
