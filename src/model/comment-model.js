import AbstractObserver from '../util/abstract-observe.js';

class CommentModel extends AbstractObserver {
  constructor() {
    super();

    this._comments = [];
  }

  setComments(comments) {
    this._comments = [...comments];
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [...this._comments, update];
  }
}

export default CommentModel;
