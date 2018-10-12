import React from "react";
import { ReactGhLikeDiff } from "react-gh-like-diff";
import Repo from "../repo.js";
import CloseIcon from "./svg/close-icon";
import moment from "moment";

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

  copyContent(e, content) {
    atom.clipboard.write(content);
    const disposable = atom.tooltips.add(e.target, {title: `Copied: ${content}`, trigger: "manual"})
    setTimeout(() => disposable.dispose(), 2000)
  }

  render() {
    const { show, commit = {} } = this.props;
    if (!show) return null;
    const avatarURL = "https://avatars.githubusercontent.com/u/e";
    const imgSrc = `${avatarURL}?email=${commit.authorEmail}&s=192`;

    return (
      <div className="commit-view native-key-bindings" style={Styles.root}>
        <div className="top-bar" style={Styles.topBar}>
          <div>
            <b>{commit.messageSubject}</b>
          </div>
          <div style={Styles.closeBtn} onClick={this.handleClose}>
            <CloseIcon className="close-icon" />
          </div>
        </div>

        <div style={Styles.wrapper}>
          <div style={Styles.info}>
            <div
              style={Object.assign({}, Styles.info.img, {
                backgroundImage: `url(${imgSrc})`
              })}
            />
            <p>
              <span style={Styles.info.name}>{commit.authorName}</span>
              <br />
              <span style={Styles.info.date}>
                Commited {moment(commit.authorDate).fromNow()}
              </span>
              <br />
              <span>{moment(commit.authorDate).format()}</span>
              <br />

              <span onClick={(e) => this.copyContent(e, commit.sha)}>
                SHA: {commit.sha}
                <span className="copy-btn" />
              </span>

            </p>
            <p>
              {commit.messageSubject}
              <br />
              {commit.messageBody}
            </p>
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
    padding: "32px"
  },
  info: {
    overflow: "hidden",
    marginBottom: "32px",
    name: {
      fontSize: "1.8em"
    },
    date: {
      textTransform: "capitalize"
    },
    img: {
      float: "left",
      width: "142px",
      height: "142px",
      marginRight: "12px",
      borderRadius: "4px",
      backgroundSize: "cover",
      backgroundColor: "#abb2bf"
    }
  }
};
