'use babel';

import CommitBookView from './commit-book-view';
import { CompositeDisposable } from 'atom';

export default {

  commitBookView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.commitBookView = new CommitBookView(state.commitBookViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.commitBookView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'commit-book:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.commitBookView.destroy();
  },

  serialize() {
    return {
      commitBookViewState: this.commitBookView.serialize()
    };
  },

  toggle() {
    console.log('CommitBook was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
