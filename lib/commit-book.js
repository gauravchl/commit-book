'use babel';

import Container from './container';
import {CompositeDisposable, Disposable} from 'atom';
module.exports = {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://commit-book') {
          return new Container();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'commit-book:toggle': () => this.toggle()
      }),

      // Destroy any CommitBookViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof Container) {
            item.destroy();
          }
        });
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    atom.workspace.toggle('atom://commit-book');
  },

  deserializeCommitBookView(serialized) {
    return new Container();
  }

};
