import { createElement } from '../util/utils.js';

const filmControlsTemplate = (film) => {
  const { userInfo } = film;

  const watchlistClass = userInfo.inWatchlist
    ? 'film-details__control-button--active'
    : '';

  const viewedClass = userInfo.isViewed
    ? 'film-details__control-button--active'
    : '';

  const favoriteClass = userInfo.isFavorite
    ? 'film-details__control-button--active'
    : '';

  return (
    `
  <section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist  ${watchlistClass}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button film-details__control-button--watched  ${viewedClass}" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClass}" id="favorite" name="favorite">Add to favorites</button>
    </section>
  `
  );
};

export default class FilmControls {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return filmControlsTemplate(this._film);
  }

  renderElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
