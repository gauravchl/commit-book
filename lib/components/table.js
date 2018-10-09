import React from "react";
import ReactTable from "react-table";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        Header: "Author",
        accessor: "author.name",
        Cell: this.nameCell,
        Filter: this.filterInput
      },
      {
        Header: "Commit message",
        accessor: "message",
        Filter: this.filterInput
      },
      {
        Header: "Hash",
        accessor: "hash",
        Filter: this.filterInput
      }
    ];
  }

  filterInput({ filter, onChange }) {
    return (
      <input
        style={{width: '100%'}}
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
    const imgSrc = `${avatarURL}?email=${commit.author.email}&s=92`;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={imgSrc}
          width={42}
          height={42}
          style={{ marginRight: "12px" }}
        />
        <div>
          <div>{commit.author.name}</div>
          <div>{commit.author.date}</div>
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

  render() {
    const { data } = this.props;
    return (
      <ReactTable
        data={data}
        columns={this.columns}
        filterable={true}
        defaultFilterMethod={this.filterMethod}
      />
    );
  }
}

export default Table;
