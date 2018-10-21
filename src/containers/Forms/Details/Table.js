import React, { Component } from "react";
//Components
import DynamicTable from "@atlaskit/dynamic-table";
import { Graphic } from "../../../components/molecules";
//Utils
import * as moment from "moment";
import { _capitalizeFirstLetter } from "../../../services/utilities";

class Table extends Component {
  state = {
    isLoading: true
  };
  _onCreateHead = () => {
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
    cells.push({
      key: dateKey[2],
      content: _capitalizeFirstLetter(dateKey[2]),
      isSortable: false,
      shouldTruncate: true,
      width: undefined
    });
    return { cells: [...cells] };
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
  _onCreateRows = () => {
    const { data } = this.props;
    const rows = [];
    data.map((res, index) => {
      let createdAt = moment(res.createdAt).format("ll");
      rows.push({
        key: `row-${index}-${res.id}`,
        cells: this._onGenerate({ ...res.data[0], createdAt })
      });
      return true;
    });
    return rows;
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

export default Table;
