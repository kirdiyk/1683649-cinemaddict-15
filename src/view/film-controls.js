import AbstractClass from './abctract.js';

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
    `<section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist  ${watchlistClass}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button film-details__control-button--watched  ${viewedClass}" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClass}" id="favorite" name="favorite">Add to favorites</button>
    </section>`
  );
};

export default class FilmControls extends AbstractClass {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return filmControlsTemplate(this._film);
  }
}
