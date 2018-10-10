import React from "react";
import Table from "./table";
import DateRange from "./date-range";

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.getDataForTable = this.getDataForTable.bind(this);
    this.handleOnDateChange = this.handleOnDateChange.bind(this);
    this.state = {
      startDate: null,
      endDate: null
    };
  }

  getDataForTable() {
    let { commits = [] } = this.props;
    const { startDate, endDate } = this.state;
    if (startDate) {
      commits = commits.filter(commit => new Date(commit.authorDate) >= startDate);
    }

    if (endDate) {
      commits = commits.filter(commit => new Date(commit.authorDate) <= endDate);
    }

    return commits;
  }

  handleOnDateChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  render() {
    const { loading, commits = [] } = this.props;
    if (loading) return <p>Loading...</p>;

    return (
      <div style={Styles.root}>
        <div>
          <h4>Total commits: {commits.length}</h4>
          <DateRange onDateChange={this.handleOnDateChange} />
        </div>
        <Table data={this.getDataForTable()} />
      </div>
    );
  }
}

export default Root;

const Styles = {
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "12px 18px 0"
  }
};
