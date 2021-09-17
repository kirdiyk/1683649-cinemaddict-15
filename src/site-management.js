import FilmModel from './model/film-model.js';
import { isOnline } from './util/utils.js';

const getSyncedFilms = (items) => items
  .filter(({ success }) => success)
  .map(({ payload }) => payload.film);

const createStoreStructure = (items) =>
  items
    .reduce((acc, rec) => ({ ...acc, [rec.id]: rec }), {});


export default class SiteManagment {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilmsData() {
    if (isOnline()) {
      return this._api.getFilmsData()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmModel.adaptToServer));
          this._store.setItems(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmModel.adaptToServer(updatedFilm));

          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  getCommentsList(film) {
    if (isOnline()) {
      return this._api.getCommentsList(film)
        .then((comments) => {
          const items = createStoreStructure(comments);
          this._store.setItem(items);

          return comments;
        });
    }

    return Promise.reject(new Error('Get comment failed'));
  }

  addComment(film, comment) {
    if (isOnline()) {
      return this._api.addComment(film, comment)
        .then((newComment) => {
          this._store.setItem(newComment.id, newComment);

          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => this._store.removeItem(id));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
