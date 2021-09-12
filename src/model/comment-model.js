import AbstractObserver from '../util/abstract-observe.js';

export default class CommentModel extends AbstractObserver {
  constructor() {
    super();

    this._comments = [];
  }

  setComments(comments) {
    if (comments === null) {
      this._comments = comments;
    }

    this._comments = [...comments];
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [...this._comments, update];
  }
}
