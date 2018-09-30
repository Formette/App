import React, { Component } from "react";
//Components
import DynamicTable from "@atlaskit/dynamic-table";
import presidents from "./presidents.json";

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
}

class Table extends Component {
  _onCreateHead = () => {
    return {
      cells: [
        {
          key: "name",
          content: "Name",
          isSortable: true,
          width: undefined
        },
        {
          key: "party",
          content: "Party",
          shouldTruncate: true,
          isSortable: true,
          width: undefined
        },
        {
          key: "term",
          content: "Term",
          shouldTruncate: true,
          isSortable: true,
          width: undefined
        },
        {
          key: "content",
          content: "Comment",
          shouldTruncate: true
        },
        {
          key: "more",
          shouldTruncate: true
        }
      ]
    };
  };
  _onCreateRows = () => {
    return presidents.map((president, index) => ({
      key: `row-${index}-${president.nm}`,
      cells: [
        {
          key: createKey(president.nm),
          content: president.nm
        },
        {
          key: createKey(president.pp),
          content: president.pp
        },
        {
          key: president.id,
          content: president.tm
        },
        {
          content: "Joe"
        },
        {
          content: president.nm
        }
      ]
    }));
  };
  render() {
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
