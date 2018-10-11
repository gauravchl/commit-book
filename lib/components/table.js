import React from "react";
import ReactTable from "react-table";
import moment from "moment";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.columns = [
      {
        Header: "Author",
        accessor: "authorName",
        Cell: this.nameCell,
        Filter: this.filterInput
      },
      {
        Header: "Message",
        accessor: "messageSubject",
        Filter: this.filterInput
      },
      {
        Header: "SHA",
        accessor: "sha",
        Filter: this.filterInput,
        Footer: ({ data = [] }) => (
          <div style={{ marginLeft: "auto" }}>
            {data.length}/{this.props.data.length} COMMITS
          </div>
        )
      }
    ];
  }

  filterInput({ filter, onChange }) {
    return (
      <input
        style={{ width: "100%" }}
        type="text"
        className="native-key-bindings cb-input"
        value={filter ? filter.value : ""}
        onChange={event => onChange(event.target.value)}
      />
    );
  }

  nameCell(props) {
    const commit = props.original;
    const avatarURL = "https://avatars.githubusercontent.com/u/e";
    const imgSrc = `${avatarURL}?email=${commit.authorEmail}&s=92`;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={imgSrc}
          width={42}
          height={42}
          style={{ marginRight: "12px", borderRadius: "4px" }}
        />
        <div>
          <div style={{ fontSize: "1.18em" }}>{commit.authorName}</div>
          <div>{moment(commit.authorDate).fromNow()}</div>
        </div>
      </div>
    );
  }

  filterMethod(filter, row) {
    let filterItem = row[filter.id];
    if (!filterItem) return false;
    const filterValue = filter.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    return filterItem.toString().search(new RegExp(filterValue, "i")) > -1;
  }

  handleRowClick(state, rowInfo, column, instance) {
    const { onRowClick } = this.props;
    return {
      onClick: (e, handleOriginal) => {
        if (onRowClick) {
          onRowClick(rowInfo && rowInfo.original);
        }
        if (handleOriginal) {
          handleOriginal();
        }
      }
    };
  }

  render() {
    const { data, filterable } = this.props;
    return (
      <ReactTable
        getTdProps={this.handleRowClick}
        noDataText="No Commits Found!"
        data={data}
        columns={this.columns}
        filterable={filterable}
        defaultFilterMethod={this.filterMethod}
      />
    );
  }
}

export default Table;
