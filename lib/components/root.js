import React from "react";
import Table from "./table";
import DateRange from "./date-range";
import FilterIcon from "./svg/filter-icon";
import CommitView from "./commit-view";

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.getDataForTable = this.getDataForTable.bind(this);
    this.handleOnDateChange = this.handleOnDateChange.bind(this);
    this.handleBranchChange = this.handleBranchChange.bind(this);
    this.renderBranchSelector = this.renderBranchSelector.bind(this);
    this.toggleTableFilter = this.toggleTableFilter.bind(this);
    this.handleTableRowClick = this.handleTableRowClick.bind(this);
    this.hideCommitView = this.hideCommitView.bind(this);
    this.state = {
      startDate: null,
      endDate: null,
      showTableFilter: false,
      showCommitView: false
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
    let selectedBranch = e.target.value;
    const { onBranchChange } = this.props;
    if (selectedBranch.startsWith("*")) {
      selectedBranch = selectedBranch.trim().substring(1);
    }
    onBranchChange && onBranchChange(selectedBranch.trim());
  }

  renderBranchSelector() {
    const { branches = [] } = this.props;

    return (
      <div style={{ position: "relative", width: "30%" }}>
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
          style={{ textIndent: "28px", width: "100%" }}
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

  toggleTableFilter() {
    const { showTableFilter } = this.state;
    this.setState({ showTableFilter: !showTableFilter });
  }

  handleTableRowClick(commit) {
    if (!commit || !commit.sha) return;
    this.setState({ showCommitView: true, selectedCommit: commit });
  }

  hideCommitView() {
    this.setState({ showCommitView: false, selectedCommit: null });
  }

  render() {
    const { loading, commits = [] } = this.props;
    const { showTableFilter, showCommitView, selectedCommit } = this.state;
    if (loading) return <p>Loading...</p>;

    return (
      <div style={Styles.root}>
        <div style={Styles.controls}>
          <DateRange
            onDateChange={this.handleOnDateChange}
            style={{ width: "30%" }}
          />
          {this.renderBranchSelector()}
          <button
            className="btn btn-default"
            onClick={this.toggleTableFilter}
            style={{ width: "30%" }}
          >
            <FilterIcon style={{ marginRight: "6px" }} />
            Filter
          </button>
        </div>
        <Table
          data={this.getDataForTable()}
          onRowClick={this.handleTableRowClick}
          filterable={showTableFilter}
        />
        <CommitView
          show={showCommitView}
          commit={selectedCommit}
          onClose={this.hideCommitView}
        />
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
    display: "flex",
    justifyContent: "space-between",
    height: "120px",
    alignItems: "center",
    padding: "0 4px"
  }
};
