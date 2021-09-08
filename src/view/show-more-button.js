import Abstract from './abctract.js';

const showMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreButton extends Abstract {
  constructor() {
    super();

    this._loadMoreClickHandler = this._loadMoreClickHandler.bind(this);
  }

  getTemplate() {
    return showMoreButtonTemplate();
  }

  _loadMoreClickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setLoadMoreClickHandler(callback) {
    this.getElement().addEventListener('click', this._loadMoreClickHandler);

    this._callback.click = callback;
  }
}
