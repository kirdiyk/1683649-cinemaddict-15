import { getDurationTime, getFormatDate, sliceDescription } from '../util/utils.js';
import AbstractClass from './abctract.js';

const createCardFilmTemplate = (film) => {
  const { title, poster, description, date, genres, rating, comments, userInfo } = film;

  const getRatingClass = () => {
    if (rating < 4) {
      return 'film-card__rating--poor';
    } else if (rating > 4 && rating < 6) {
      return 'film-card__rating--average';
    }
    return 'film-card__rating--good';
  };

  const watchlistClass = userInfo.inWatchlist
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClass = userInfo.isFavorite
    ? 'film-card__controls-item--active'
    : '';

  const viewedClass = userInfo.isViewed
    ? 'film-card__controls-item--active'
    : '';
  return (
    `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating ${getRatingClass()}">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getFormatDate(date.releaseDate, 'YYYY')}</span>
      <span class="film-card__duration">${getDurationTime(date.runtime, 'minute')}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src=${poster} alt="${title}" class="film-card__poster">
    <p class="film-card__description">${sliceDescription(description)}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClass}" type="button">Add to watchlist </button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${viewedClass}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite  ${favoriteClass}" type="button">Mark as favorite</button>
    </div>
  </article>`
  );
};

export default class FilmCard extends AbstractClass {
  constructor(film) {
    super();
    this._film = film;
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
  }

  getTemplate() {
    return createCardFilmTemplate(this._film);
  }

  _filmCardClickHandler(evt) {
    const target = evt.target;
    if (target.matches('.film-card__poster')
      || target.matches('.film-card__title')
      || target.matches('.film-card__comments')) {
      this._callback.click();
    }
  }

  setFilmCardClickHandler(callback) {
    this._callback.click = callback;
    this.renderElement().addEventListener('click', this._filmCardClickHandler);
  }
}
