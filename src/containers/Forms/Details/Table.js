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
import * as moment from "moment";
import { _capitalizeFirstLetter } from "../../../services/utilities";
//locales
import { FormattedMessage } from "react-intl";
//API
import { FORM_DATA_QUERY } from "../../../api/Queries";
import { DELETE_FORM_CONTENT_MUTATION } from "../../../api/Mutations";

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
      console.log("_onCreateHead = ", error);
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
        <DropdownItemGroup title="Actions">
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
  _onDeleteContent = async id => {
    const { deleteFormContentMutation, formId } = this.props;
    //console.log("match.params.id = ", match.params.id);
    try {
      await deleteFormContentMutation({
        variables: {
          id
        },
        update: (store, { data: { deleteContent } }) => {
          try {
            //reads the query from the cache
            const data = store.readQuery({
              query: FORM_DATA_QUERY,
              variables: { id: formId }
            });
            //finds and removes the form from the object
            data.Forms.contents.forEach((value, index) => {
              if (value.id === deleteContent.id) {
                data.Forms.contents.splice(index, 1);
              }
            });
            //updates the new data to the store
            store.writeQuery({
              query: FORM_DATA_QUERY,
              variables: { id: formId },
              data
            });
          } catch (e) {
            return e;
          }
        }
      });
    } catch (error) {
      // console.log("_onDeleteContent  = ", error);
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
      // console.log("_onCreateRows = ", error);
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
  graphql(DELETE_FORM_CONTENT_MUTATION, { name: "deleteFormContentMutation" })
)(Table);
