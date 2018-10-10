"use babel";

import React from "react";
import ReactDom from "react-dom";
import Root from "./components/root.js";
import Repo from "./repo.js";

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
    this.handleBranchChange = this.handleBranchChange.bind(this);
    this.state = {
      loading: true
    };
    Repo.getCommits().then(commits => {
      this.setState({ commits, loading: false });
    });

    Repo.getBranches().then(branches => {
      this.setState({ branches, loading: false });
    });
  }

  handleBranchChange(newBranch) {
    Repo.getCommits({ ref: newBranch }).then(commits => {
      this.setState({ commits });
    });
  }

  render() {
    const { loading, branches, commits } = this.state;
    return (
      <Root
        loading={loading}
        commits={commits}
        branches={branches}
        onBranchChange={this.handleBranchChange}
      />
    );
  }
}
