import React, { Component } from "react";
//Components
import DynamicTable from "@atlaskit/dynamic-table";
import { Graphic } from "../../../components/molecules";
//Utils
//import * as moment from "moment";

class Table extends Component {
  state = {
    isLoading: true
  };
  _onCreateHead = () => {
    const { data: content } = this.props;
    const cells = [];
    const keys = Object.keys(content[0].data[0]);

    keys.map(item => {
      if (item !== "__typename") {
        cells.push({
          key: item,
          content: item,
          isSortable: true,
          width: undefined
        });
      }
      return true;
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
      rows.push({
        key: `row-${index}-${res.id}`,
        cells: this._onGenerate(res.data[0])
      });
      return true;
    });
    return rows;
  };
  render() {
    if (Object.keys(this.props.data).length === 0) {
      return (
        <Graphic
          title="Form without data"
          description="This form has not received any data yet, paste the endpoint into the form of your site to start collecting data."
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
        defaultSortKey="term"
        defaultSortOrder="ASC"
        onSort={() => console.log("onSort")}
        onSetPage={() => console.log("onSetPage")}
      />
    );
  }
}

export default Table;
