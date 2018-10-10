import React from "react";
import Table from "./table";
import DateRange from "./date-range";

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.getDataForTable = this.getDataForTable.bind(this);
    this.handleOnDateChange = this.handleOnDateChange.bind(this);
    this.handleBranchChange = this.handleBranchChange.bind(this);
    this.renderBranchSelector = this.renderBranchSelector.bind(this);
    this.state = {
      startDate: null,
      endDate: null
    };
  }

  getDataForTable() {
    let { commits = [] } = this.props;
    const { startDate, endDate } = this.state;
    if (startDate) {
      commits = commits.filter(
        commit => new Date(commit.authorDate) >= startDate
      );
    }

    if (endDate) {
      commits = commits.filter(
        commit => new Date(commit.authorDate) <= endDate
      );
    }
    return commits;
  }

  handleOnDateChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  handleBranchChange(e) {
    const selectedBranch = e.target.value;
    const { onBranchChange } = this.props;
    onBranchChange && onBranchChange(selectedBranch);
  }

  renderBranchSelector() {
    const { branches=[] } = this.props;

    return (
      <div style={{ position: "relative" }}>
        <span
          className="icon icon-git-branch"
          style={{
            position: "absolute",
            left: "14px",
            top: "6.8px"
          }}
        />
        <select
          className="cb-select"
          title="Branches"
          onChange={this.handleBranchChange}
          defaultValue={branches.find(branch => branch.startsWith("*"))}
          style={{ textIndent: "28px", width: '280px' }}
        >
          {branches.map((branch, i) => {
            return (
              <option key={i} value={branch}>
                {branch}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  render() {
    const { loading, commits = [] } = this.props;
    if (loading) return <p>Loading...</p>;

    return (
      <div style={Styles.root}>
        <div style={Styles.controls}>
          <DateRange onDateChange={this.handleOnDateChange} />
          {this.renderBranchSelector()}
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
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "12px 18px 0"
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '120px',
    alignItems: 'center',
    padding: '0 4px'
  }
};
