import React from "react";
import { ReactGhLikeDiff } from "react-gh-like-diff";
import Repo from "../repo.js";
import CloseIcon from "./svg/close-icon";

// <ReactGhLikeDiff
//   diffString={diff}
//   options={{ outputFormat: "line-by-line" }}
// />
class CommitView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, commit, onClose } = this.props;
    if (!show) return null;

    return (
      <div className='commit-view' style={Styles.root}>
        <div style={Styles.closeBtn} onClick={onClose}>
          <CloseIcon className='close-icon' />
        </div>
        Commit view
      </div>
    );
  }
}

export default CommitView;

const Styles = {
  root: {
    position: "absolute",
    left: "0px",
    top: "0px",
    right: "0px",
    bottom: "0px"
  },
  closeBtn: {
    position: 'absolute',
    right: '8px',
    top: '8px',
    cursor: 'pointer'
  }
};
