import React from "react";
import ReactTable from "react-table";

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.getDataForTable = this.getDataForTable.bind(this);
    this.columns = [
      {
        Header: "Name",
        accessor: "author.name"
      },
      {
        Header: "Commit message",
        accessor: "message"
      },
      {
        Header: "Hash",
        accessor: "hash"
      }
    ];
  }

  getDataForTable() {
    const { commits = [] } = this.props;
    return commits;
  }

  render() {
    const { loading } = this.props;
    if (loading) return <p>Loading...</p>;

    return (
      <div>
        <p>Commit Book</p>
        <p>Loading: {loading}</p>
        <ReactTable data={this.getDataForTable()} columns={this.columns} />
      </div>
    );
  }
}

export default Root;
