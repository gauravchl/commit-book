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
      this.setState({commits, loading: false})
    })
  }

  async getCommits() {
    const paths = atom.project.getPaths();
    const path = paths && paths[0];
    if (!path) return;
    const format = {
      hash: "%H",
      message: "%s",
      author: {
        date: "%ai",
        name: "%an",
        email: "%ae"
      },
      committer: {
        date: "%ci",
        name: "%cn",
        email: "%ce"
      }
    };

    const stringFormat = JSON.stringify(format).replace(/"/gm, '^@^');
    const result = await GitProcess.exec(
      ["log", `--format=^@^%H^@^:${stringFormat},`],
      path
    );
    let { stdout = "", stderr, exitCode } = result;
    stdout = stdout.trim();
    const commits = stdout.substring(0, stdout.length - 1).replace(/"/gm, '\\"').replace(/\^@\^/gm, '"');

    const jsonCommits = JSON.parse(`{${commits}}`);
    return Object.values(jsonCommits);
  }

  render() {
    return (
      <Root
        loading={this.state.loading}
        commits={this.state.commits}
      />
    )
  }
}
