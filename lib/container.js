"use babel";

import React from "react";
import ReactDom from "react-dom";
import Root from "./components/root.js";
import { GitProcess } from "dugite";

export default class Container {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement("div");
    this.element.classList.add("commit-book");
    this.render();
  }

  getTitle() {
    // Used by Atom for tab text
    return "Commit Book";
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return "center";
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ["center"];
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return "atom://commit-book";
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      deserializer: "commit-book/Container"
    };
  }

  // Tear down any state and detach
  destroy() {
    ReactDom.unmountComponentAtNode(this.element);
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  render() {
    ReactDom.render(<ReactRootContainer />, this.element);
  }
}

class ReactRootContainer extends React.Component {
  constructor(props) {
    super(props);
    this.getCommits = this.getCommits.bind(this);
    this.state = {
      loading: true
    };
    this.getCommits().then(commits => {
      this.setState({ commits, loading: false });
    });
  }

  async getCommits(option) {
    const paths = atom.project.getPaths();
    const path = paths && paths[0];
    if (!path) return;

    const { max = 10000, ref = "HEAD" } = option || {};


    const result = await GitProcess.exec(
      [
        "log",
        "--pretty=format:%H%x00%ae%x00%ai%x00%s%x00%b%x00%an",
        "--no-abbrev-commit",
        "-z",
        "-n",
        max,
        ref,
        "--"
      ],
      path
    );
    const { stdout = "", stderr, exitCode } = result;
    if (exitCode !== 0 || stdout === "") {
      return [];
    }
    const fields = stdout.trim().split("\0");
    const commits = [];
    for (let i = 0; i < fields.length; i += 6) {
      const body = fields[i + 4];

      const {
        message: messageBody,
        coAuthors
      } = getMessageAndCoAuthor(body);

      commits.push({
        sha: fields[i] && fields[i].trim(),
        authorEmail: fields[i + 1] && fields[i + 1].trim(),
        authorDate: fields[i + 2],
        authorName: fields[i + 5] && fields[i + 5].trim(),
        messageSubject: fields[i + 3],
        messageBody,
        coAuthors
      });
    }
    return commits;
  }

  render() {
    return <Root loading={this.state.loading} commits={this.state.commits} />;
  }
}

function getMessageAndCoAuthor(commitMessage) {
  const LINE_ENDING_REGEX = /\r?\n/;
  const CO_AUTHOR_REGEX = /^co-authored-by. (.+?) <(.+?)>$/i;
  const messageLines = [];
  const coAuthors = [];

  for (const line of commitMessage.split(LINE_ENDING_REGEX)) {
    const match = line.match(CO_AUTHOR_REGEX);
    if (match) {
      const [_, name, email] = match;
      coAuthors.push({ name, email });
    } else {
      messageLines.push(line);
    }
  }

  return { message: messageLines.join("\n"), coAuthors };
}
