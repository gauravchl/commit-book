'use babel';

import React from 'react';
import ReactDom from 'react-dom';
import RootComponent from './components/index.js'


export default class CommitBookView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('commit-book');

    ReactDom.render(RootComponent, this.element);

    // this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
    //   if (!atom.workspace.isTextEditor(item)) return;
    //   message.innerHTML = `
    //     <h2>${item.getFileName() || 'untitled'}</h2>
    //     <ul>
    //       <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
    //       <li><b>Tab Length:</b> ${item.getTabLength()}</li>
    //       <li><b>Encoding:</b> ${item.getEncoding()}</li>
    //       <li><b>Line Count:</b> ${item.getLineCount()}</li>
    //     </ul>
    //   `;
    // });
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
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

}
