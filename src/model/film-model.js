import AbstractObserver from '../util/abstract-observe.js';
import { FILM_CARD_EXTRA, TOP_RATED } from '../util/const.js';

export default class FilmModel extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = [...films];

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }


  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can not update film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  getRatedFilms() {
    return [...this._films]
      .filter((film) => film.filmRating > TOP_RATED)
      .sort((a, b) => (b.filmRating > a.filmRating ? 1 : -1))
      .slice(0, FILM_CARD_EXTRA);
  }

  getCommentedFilms() {
    return [...this._films]
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, FILM_CARD_EXTRA);
  }

  addComment(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t add comment to unexisting film');
    }
    this._films[index].comments = update.comments;
    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];
    this._notify(updateType, update);
  }
}
