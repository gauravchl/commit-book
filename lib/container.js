'use babel';

import React from 'react';
import ReactDom from 'react-dom';
import Root from './components/root.js'


export default class Container {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('commit-book');
    this.render();
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Commit Book';
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'center';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['center'];
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://commit-book'
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      deserializer: 'commit-book/CommitBookView'
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
    ReactDom.render(<Root />, this.element);
  }
}
