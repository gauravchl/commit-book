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
    const { loading, commits=[] } = this.props;
    if (loading) return <p>Loading...</p>;

    return (
      <div style={Styles.root}>
        <div>
          <h4>Total commits: {commits.length}</h4>
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
    padding: '12px 18px 0'
  }
}
