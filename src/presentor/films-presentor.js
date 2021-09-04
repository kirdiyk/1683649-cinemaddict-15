import { FILM_CARD_EXTRA, FILM_CARD, RenderPosition, TOP_RATED } from '../util/const.js';
import { removeComponent, render } from '../util/render.js';
import { sortByDate, sortByRating, updateItem, SortType  } from '../util/utils.js';

import FilmCardPresenter from './film-card-presentor.js';
import UserProfile from '../view/profile-user.js';
import EmptyList from '../view/empty-list.js';
import FilmsContainer from '../view/container-film.js';
import FilmList from '../view/list-film.js';
import FooterStats from '../view/stats-film-footer.js';
import Menu from '../view/site-menu-list.js';
import SortFilmList from '../view/sort-menu.js';
import FilmListRated from '../view/popular-film.js';
import FilmListCommented from '../view/film-list-commented.js';
import ShowMoreButton from '../view/button-more.js';

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
  }

  init(dataFilms, dataComments) {
    this._dataFilms = [...dataFilms];
    this._defaultDataFilms = [...dataFilms];

    this._ratedFilmData = [...dataFilms]
      .filter((film) => film.rating > TOP_RATED)
      .sort((a, b) => (b.rating > a.rating) ? 1 : -1)
      .slice(0, 2);
    this._commentedFilmData = [...dataFilms]
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, FILM_CARD_EXTRA);

    this._dataComments = [...dataComments];

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
    if (!this._dataFilms.length) {
      this._renderEmptyFilmsMessage();
      return;
    }

    this._renderMainFilmCards();
    this._renderRatedFilmCards();
    this._renderCommentedFilmCards();
  }

  _renderMainFilmCards() {
    this._mainFilmListInner = this._filmsContainerComponent.renderElement().querySelector('.films-list__container');
    this._renderFilmCards(this._mainFilmListInner, this._dataFilms, 0, Math.min(this._dataFilms.length, FILM_CARD));

    if (this._dataFilms.length > FILM_CARD) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilmCards() {
    this._filmListRatedInner = this._filmListRatedComponent.renderElement().querySelector('.films-list__container');
    this._renderFilmCards(this._filmListRatedInner, this._ratedFilmData, 0, FILM_CARD_EXTRA, 'rated');
  }

  _renderCommentedFilmCards() {
    this._filmListCommentedInner = this._filmListCommentedComponent.renderElement().querySelector('.films-list__container');
    this._renderFilmCards(this._filmListCommentedInner, this._commentedFilmData, 0, FILM_CARD_EXTRA, 'commented');
  }

  _filmCardChangeHadler(updatedFilm) {
    this._dataFilms = updateItem(this._dataFilms, updatedFilm);
    this._defaultDataFilms = updateItem(this._defaultDataFilms, updatedFilm);
    this._ratedFilmData = updateItem(this._ratedFilmData, updatedFilm);
    this._commentedFilmData = updateItem(this._commentedFilmData, updatedFilm);
    this._filmCardPresenter.get(updatedFilm.id).init(updatedFilm, []);
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
        this._dataFilms.sort(sortByDate);
        break;
      case SortType.RATING:
        this._dataFilms.sort(sortByRating);
        break;
      default:
        this._dataFilms = [...this._defaultDataFilms];
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

  _renderFilmCard(container, film, comments, type = '') {
    if (type === 'rated') {
      const ratedFilmCardPresenter = new FilmCardPresenter(container, this._filmCardChangeHadler);
      ratedFilmCardPresenter.init(film, comments);
      this._ratedFilmCardPresenter.set(film.id, ratedFilmCardPresenter);
      return;
    }

    if (type === 'commented') {
      const commentedFilmCardPresenter = new FilmCardPresenter(container, this._filmCardChangeHadler);
      commentedFilmCardPresenter.init(film, comments);
      this._commentedFilmCardPresenter.set(film.id, commentedFilmCardPresenter);
      return;
    }

    const mainFilmCardPresenter = new FilmCardPresenter(container, this._filmCardChangeHadler);
    mainFilmCardPresenter.init(film, comments);
    this._filmCardPresenter.set(film.id, mainFilmCardPresenter);
  }

  _renderFilmCards(container, filmsData, from, to, type) {
    filmsData
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film, this._dataComments, type));
  }

  _renderEmptyFilmsMessage() {
    removeComponent(this._sortFilmListComponent);
    removeComponent(this._filmListComponent);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);
    removeComponent(this._showMoreButtonComponent);
    render(this._filmsContainerComponent, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _showMoreFilmsClickHandler() {
    this._renderFilmCards(this._mainFilmListInner, this._dataFilms, this._renderedTaskCount, this._renderedTaskCount + FILM_CARD);
    this._renderedTaskCount += FILM_CARD;

    if (this._renderedTaskCount >= this._dataFilms.length) {
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

  _clearMainFilmList() {
    this._filmCardPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardPresenter.clear();
    this._renderedTaskCount = FILM_CARD;

    removeComponent(this._showMoreButtonComponent);
  }

}
