'use babel';

import CommitBookView from './commit-book-view';
import {CompositeDisposable, Disposable} from 'atom';
export default {

  subscriptions: null,

  activate(state) {
    console.log('#activate')
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://commit-book') {
          return new CommitBookView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'commit-book:toggle': () => this.toggle()
      }),

      // Destroy any CommitBookViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof CommitBookView) {
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
    console.log('commit-book.toggle')
    atom.workspace.toggle('atom://commit-book');
  },

  deserializeCommitBookView(serialized) {
    return new CommitBookView();
  }

};
