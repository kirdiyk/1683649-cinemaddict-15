import { FILM_CARD_EXTRA, FILM_CARD, RenderPosition, TOP_RATED } from '../util/const.js';
import { removeComponent, render } from '../util/render.js';
import { sortByDate, sortByRating, updateItem, SortType  } from '../util/utils.js';

import FilmCardPresenter from './film-card-presenter.js';
import UserProfile from '../view/user-profile.js';
import EmptyList from '../view/empty-list.js';
import FilmsContainer from '../view/films-container.js';
import FilmList from '../view/film-list.js';
import FooterStats from '../view/footer-stats.js';
import Menu from '../view/menu.js';
import SortFilmList from '../view/sort-film-list.js';
import FilmListRated from '../view/film-list-rated.js';
import FilmListCommented from '../view/film-list-commented.js';
import ShowMoreButton from '../view/show-more-button.js';

export default class Films {
  constructor(headerContainer, mainContainer, footerContainer, filters) {
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._footerContainer = footerContainer;

    this._renderedTaskCount = FILM_CARD;
    this._filmCardPresenter = new Map();
    this._ratedFilmCardPresenter = new Map();
    this._commentedFilmCardPresenter = new Map();

    this._userProfileComponent = new UserProfile();
    this._menuNavigationComponent = new Menu(filters);
    this._sortFilmListComponent = new SortFilmList();
    this._filmsContainerComponent = new FilmsContainer();
    this._filmListComponent = new FilmList();
    this._filmListRatedComponent = new FilmListRated();
    this._filmListCommentedComponent = new FilmListCommented();
    this._emptyListComponent = new EmptyList();
    this._filmStatsComponent = new FooterStats();
    this._showMoreButtonComponent = new ShowMoreButton();

    this._filmCardChangeHadler = this._filmCardChangeHadler.bind(this);
    this._showMoreFilmsClickHandler = this._showMoreFilmsClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._cardModeChangeHandler = this._cardModeChangeHandler.bind(this);
  }

  init(films, comments) {
    this._films = [...films];
    this._defaultDataFilms = [...films];

    this._ratedFilmData = [...films]
      .filter((film) => film.rating > TOP_RATED)
      .sort((a, b) => (b.rating > a.rating) ? 1 : -1)
      .slice(0, 2);
    this._commentedFilmData = [...films]
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, FILM_CARD_EXTRA);

    this._comments = [...comments];

    this._renderUserProfile();
    this._renderNavigationMenu();
    this._renderSortFilmList();

    this._renderFilmsContainer();
    this._renderFilmsList();
    this._renderFilmsListRated();
    this._renderFilmsListCommented();
    this._renderFilms();

    this._renderShowMoreButton();
    this._renderDataFilmsCounter();
  }


  _renderFilms() {
    if (!this._films.length) {
      this._getEmptyFilmsMessage();
      return;
    }

    this._renderMainFilmCards();
    this._renderRatedFilmCards();
    this._renderCommentedFilmCards();
  }

  _renderMainFilmCards() {
    this._mainFilmListInner = this._filmsContainerComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(
      this._mainFilmListInner,
      this._films,
      0, Math.min(this._films.length, FILM_CARD),
      this._filmCardPresenter,
    );

    if (this._films.length > FILM_CARD) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilmCards() {
    this._filmListRatedInner = this._filmListRatedComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(
      this._filmListRatedInner,
      this._ratedFilmData,
      0,
      FILM_CARD_EXTRA,
      this._ratedFilmCardPresenter,
    );
  }

  _renderCommentedFilmCards() {
    this._filmListCommentedInner = this._filmListCommentedComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(
      this._filmListCommentedInner,
      this._commentedFilmData,
      0,
      FILM_CARD_EXTRA,
      this._commentedFilmCardPresenter,
    );
  }

  // Метод для очистки мапов
  _clearCardPresenter(filmCardPresenter) {
    filmCardPresenter.forEach((presenter) => presenter.destroy());
    filmCardPresenter.clear();
  }

  _filmCardChangeHadler(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._defaultDataFilms = updateItem(this._defaultDataFilms, updatedFilm);
    const initFilmCardPresenter = (presenters) => {
      if (presenters.has(updatedFilm.id)) {
        presenters.get(updatedFilm.id).init(updatedFilm, this._getComments(updatedFilm.id));
      }
    };

    initFilmCardPresenter(this._filmCardPresenter);
    initFilmCardPresenter(this._ratedFilmCardPresenter);
    initFilmCardPresenter(this._commentedFilmCardPresenter);
  }

  _cardModeChangeHandler() {
    this._filmCardPresenter.forEach((presenter) => presenter.resetView());
    this._ratedFilmCardPresenter.forEach((presenter) => presenter.resetView());
    this._commentedFilmCardPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderFilmsContainer() {
    render(this._mainContainer, this._filmsContainerComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsList() {
    render(this._filmsContainerComponent, this._filmListComponent, RenderPosition.BEFOREEND);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortByDate);
        break;
      case SortType.RATING:
        this._films.sort(sortByRating);
        break;
      default:
        this._films = [...this._defaultDataFilms];
    }

    this._currentSortType = sortType;
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearMainFilmList();
    this._renderMainFilmCards();
  }

  _renderUserProfile() {
    render(this._headerContainer, this._userProfileComponent, RenderPosition.BEFOREEND);
  }

  _renderNavigationMenu() {
    render(this._mainContainer, this._menuNavigationComponent, RenderPosition.BEFOREEND);
  }

  _renderSortFilmList() {
    render(this._mainContainer, this._sortFilmListComponent, RenderPosition.BEFOREEND);
    this._sortFilmListComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _renderFilmsListRated() {
    render(this._filmsContainerComponent, this._filmListRatedComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListCommented() {
    render(this._filmsContainerComponent, this._filmListCommentedComponent, RenderPosition.BEFOREEND);
  }

  _getComments(id) {
    const comments = this._comments.find((comment) => comment.has(id));
    return comments.get(id);
  }

  _renderFilmCard(container, film, filmCardPresenter) {
    const mainFilmCardPresenter = new FilmCardPresenter(container, this._filmCardChangeHadler, this._cardModeChangeHandler);
    mainFilmCardPresenter.init(film, this._getComments(film.id));
    filmCardPresenter.set(film.id, mainFilmCardPresenter);
  }

  _renderFilmCards(container, filmsData, from, to, filmCardPresenter) {
    filmsData
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film, filmCardPresenter));
  }

  _getEmptyFilmsMessage() {
    removeComponent(this._sortFilmListComponent);
    removeComponent(this._filmListComponent);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);
    removeComponent(this._showMoreButtonComponent);
    render(this._filmsContainerComponent, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _showMoreFilmsClickHandler() {
    this._renderFilmCards(
      this._mainFilmListInner,
      this._films,
      this._renderedTaskCount,
      this._renderedTaskCount + FILM_CARD,
      this._filmCardPresenter,
    );
    this._renderedTaskCount += FILM_CARD;

    if (this._renderedTaskCount >= this._films.length) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setLoadMoreClickHandler(this._showMoreFilmsClickHandler);
  }

  _renderDataFilmsCounter() {
    render(this._footerContainer, this._filmStatsComponent, RenderPosition.BEFOREEND);
  }

  _clearFilmList() {
    this._clearCardPresenter(this._filmCardPresenter);
    this._clearCardPresenter(this._ratedFilmCardPresenter);
    this._clearCardPresenter(this._commentedFilmCardPresenter);
    this._renderedTaskCount = FILM_CARD;

    removeComponent(this._showMoreButtonComponent);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);
  }

  _clearMainFilmList() {
    this._clearCardPresenter(this._filmCardPresenter);
    this._renderedTaskCount = FILM_CARD;
    removeComponent(this._showMoreButtonComponent);
  }
}
