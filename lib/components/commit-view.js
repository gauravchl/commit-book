import React from "react";
import { ReactGhLikeDiff } from "react-gh-like-diff";
import Repo from "../repo.js";
import CloseIcon from "./svg/close-icon";
class CommitView extends React.Component {
  constructor(props) {
    super(props);
    this.renderDiff = this.renderDiff.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      diffString: null
    };
  }

  renderDiff() {
    const { diffString } = this.state;
    const { commit } = this.props;
    if (!diffString && commit && commit.sha) {
      Repo.getCommitDiff(commit && commit.sha).then(diffString => {
        this.setState({ diffString });
      });
      return null;
    }

    return (
      <ReactGhLikeDiff
        diffString={diffString}
        options={{ outputFormat: "line-by-line" }}
      />
    );
  }

  handleClose() {
    const { onClose } = this.props;
    this.setState({ diffString: null });
    onClose && onClose();
  }

  render() {
    const { show, commit = {} } = this.props;
    if (!show) return null;

    return (
      <div className="commit-view" style={Styles.root}>
        <div className="top-bar" style={Styles.topBar}>
          <div>
            <b>{commit.messageSubject}</b>
          </div>
          <div style={Styles.closeBtn} onClick={this.handleClose}>
            <CloseIcon className="close-icon" />
          </div>
        </div>

        <div style={Styles.wrapper}>
          <div>
            Commit view
            <p>Author Name: {commit.authorName}</p>
            <p>Date: {commit.authorDate}</p>
            <p>SHA: {commit.sha}</p>
            <p>Subject: {commit.messageSubject}</p>
            <p>Body: {commit.body}</p>
          </div>
          {this.renderDiff()}
        </div>
      </div>
    );
  }
}

export default CommitView;

const Styles = {
  root: {
    position: "absolute",
    left: "52px",
    top: "52px",
    right: "52px",
    bottom: "52px",
    paddingBottom: "42px",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.72) 0px 1px 26px 100px",
    overflow: "hidden"
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "42px",
    padding: "12px"
  },
  closeBtn: {
    width: "24px",
    height: "24px",
    cursor: "pointer"
  },
  wrapper: {
    height: "100%",
    overflow: "scroll",
    position: "relative",
    padding: "12px"
  }
};
