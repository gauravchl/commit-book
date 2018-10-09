import React from "react";
import Table from "./table";

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.getDataForTable = this.getDataForTable.bind(this);
  }

  getDataForTable() {
    const { commits = [] } = this.props;
    return commits;
  }

  render() {
    const { loading } = this.props;
    if (loading) return <p>Loading...</p>;

    return (
      <div style={Styles.root}>
        <div>
          <p>Commit Book</p>
          <p>Loading: {loading}</p>
        </div>
        <Table data={this.getDataForTable()} />
      </div>
    );
  }
}

export default Root;

const Styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }
}
