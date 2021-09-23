import {  FILM_CARD, RenderPosition, UpdateType, FilterType, StatsTime, UserAction, TypeList} from '../util/const.js';
import { removeComponent, render } from '../util/render.js';
import { sortByDate, sortByRating, SortType, filterStatsByWatchingDate, filter, getUserRating} from '../util/utils.js';
import FilmSection from '../view/film-section.js';
import Statistic from '../view/statistic.js';
import SortFilmList from '../view/sort-film-list.js';
import FilmCardPresenter from './film-card-presenter.js';
import FilmList from '../view/film-list.js';
import FooterStats from '../view/footer-stats.js';
import FilmListCommented from '../view/film-list-commented.js';
import FilmListRated from '../view/film-list-rated.js';
import Loader from '../view/loader.js';
import EmptyList from '../view/empty-list.js';
import ShowMoreButton from '../view/show-more-button.js';
import FilmListContainer from '../view/film-list-container.js';

class FilmsPresenter {
  constructor(mainContainer, footerContainer, filmsModel, filterModel, api) {
    this._mainContainer = mainContainer;
    this._footerContainer = footerContainer;

    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmsCount = FILM_CARD;
    this._currentScreen = TypeList.FILMS;
    this._currentStatsFilter = FilterType.ALL;

    this._isLoading = true;
    this._api = api;

    this._filmCardPresenter = new Map();
    this._ratedFilmCardPresenter = new Map();
    this._commentedFilmCardPresenter = new Map();

    this._filmsSection = new FilmSection();
    this._filmsList = new FilmList();
    this._filmsListContainer = new FilmListContainer();
    this._footerStatsComponent = new FooterStats();
    this._loadingComponent = new Loader();

    this._sortFilmListComponent = null;
    this._showMoreButtonComponent = null;
    this._emptyListComponent = null;
    this._filmListRatedContainer = null;
    this._filmListRatedComponent = null;
    this._filmListCommentedContainer = null;
    this._filmListCommentedComponent = null;

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._showMoreFilmsClickHandler = this._showMoreFilmsClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._cardModeChangeHandler = this._cardModeChangeHandler.bind(this);

    this._statsFilterChangeHandler = this._statsFilterChangeHandler.bind(this);
  }

  init() {
    this._renderFilmsSection();

    this._filmsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  _renderFilmsSection() {
    if (this._isLoading) {
      render(this._mainContainer, this._filmsSection, RenderPosition.BEFOREEND);
      this._renderLoading();
      return;
    }

    this._renderSortFilmList();

    render(this._mainContainer, this._filmsSection, RenderPosition.BEFOREEND);

    this._renderAllFilms();
    this._renderRatedFilms();
    this._renderCommentedFilms();
  }

  _renderAllFilms() {
    const films = this._getFilms();
    const filmsCount = films.length;

    if (!filmsCount) {
      this._renderEmptyFilmsMessage();
      return;
    }

    render(this._filmsSection, this._filmsList, RenderPosition.AFTERBEGIN);
    render(this._filmsList, this._filmsListContainer, RenderPosition.BEFOREEND);

    this._renderFilmCards(
      this._filmsListContainer,
      films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)),
      this._filmCardPresenter,
    );

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilms() {
    if (this._filmListRatedComponent !== null && this._filmListRatedContainer !== null) {
      removeComponent(this._filmListRatedComponent);
      removeComponent(this._filmListRatedContainer);
      this._filmListRatedContainer = null;
      this._filmListRatedComponent = null;
    }

    if (!this._getFilms().length) {
      return;
    }

    const films = [...this._filmsModel.getRatedFilms()];

    if (films[0].filmRating === 0) {
      return;
    }

    this._filmListRatedContainer = new FilmListContainer();
    this._filmListRatedComponent = new FilmListRated();

    render(this._filmsSection, this._filmListRatedComponent, RenderPosition.BEFOREEND);
    render(this._filmListRatedComponent, this._filmListRatedContainer, RenderPosition.BEFOREEND);

    this._renderFilmCards(this._filmListRatedContainer, films, this._ratedFilmCardPresenter);
  }

  _renderCommentedFilms() {
    if (this._filmListCommentedContainer !== null && this._filmListCommentedComponent !== null) {
      removeComponent(this._filmListCommentedComponent);
      removeComponent(this._filmListCommentedContainer);
      this._filmListCommentedContainer = null;
      this._filmListCommentedComponent = null;
    }

    if (!this._getFilms().length) {
      return;
    }

    const films = [...this._filmsModel.getCommentedFilms()];

    if (films[0].comments.length === 0) {
      return;
    }

    this._filmListCommentedContainer = new FilmListContainer();
    this._filmListCommentedComponent = new FilmListCommented();

    render(this._filmsSection, this._filmListCommentedComponent, RenderPosition.BEFOREEND);
    render(
      this._filmListCommentedComponent,
      this._filmListCommentedContainer,
      RenderPosition.BEFOREEND,
    );

    this._renderFilmCards(
      this._filmListCommentedContainer,
      films,
      this._commentedFilmCardPresenter,
    );
  }

  _renderFilmCard(container, film, filmCardPresenter) {
    const mainFilmCardPresenter = new FilmCardPresenter(
      container,
      this._viewActionHandler,
      this._cardModeChangeHandler,
      this._filterType,
      this._api,
    );

    filmCardPresenter.set(film.id, mainFilmCardPresenter);
    mainFilmCardPresenter.init(film, film.comments);
  }

  _renderFilmCards(container, films, filmCardPresenter) {
    films.forEach((film) => this._renderFilmCard(container, film, filmCardPresenter));
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms= filter[this._filterType](films);

    this._currentProfileRating = getUserRating(filter[FilterType.HISTORY](films).length);

    if (this._filterType === FilterType.STATS) {
      this._currentScreen = TypeList.STATS;
      return filteredFilms;
    }

    this._currentScreen = TypeList.FILMS;

    switch (this._currentSortType) {
      case SortType.DATE: {
        return filteredFilms.sort(sortByDate);
      }
      case SortType.RATING: {
        return filteredFilms.sort(sortByRating);
      }
    }

    return filteredFilms;
  }

  _viewActionHandler(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM: {
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .then(() => {
            this._rerenderPresenterPopup(this._filmCardPresenter, update);
            this._rerenderPresenterPopup(this._ratedFilmCardPresenter, update);
            this._rerenderPresenterPopup(this._commentedFilmCardPresenter, update);
          })
          .catch(() => {
            this._setShakeStatePresenter(this._filmCardPresenter, update);
            this._setShakeStatePresenter(this._ratedFilmCardPresenter, update);
            this._setShakeStatePresenter(this._commentedFilmCardPresenter, update);
          });
        break;
      }
      case UserAction.UPDATE_POPUP: {
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .then(() => {
            this._updatePresenterComments(this._filmCardPresenter, update);
            this._updatePresenterComments(this._ratedFilmCardPresenter, update);
            this._updatePresenterComments(this._commentedFilmCardPresenter, update);
          });
        break;
      }
    }
  }

  _initFilmCardPresenter(presenters, data) {
    if (presenters.has(data.id)) {
      presenters.get(data.id).init(data, data.comments);
    }
  }

  _updatePresenterComments(presenter, data) {
    if (presenter.has(data.id)) {
      return presenter.get(data.id).updateComments();
    }
  }

  _rerenderPresenterPopup(presenter, data) {
    if (presenter.has(data.id)) {
      return presenter.get(data.id).rerenderPopup();
    }
  }

  _setShakeStatePresenter(presenter, data) {
    if (presenter.has(data.id)) {
      return presenter.get(data.id).setShakeState();
    }
  }

  _modelEventHandler(updateType, data) {
    const films = this._filmsModel.getFilms();
    const filteredFilms= filter[FilterType.HISTORY](films);

    switch (updateType) {
      case UpdateType.INIT: {
        this._isLoading = false;
        this._clearFilmList({ resetFilmCounter: true, resetSortType: true });
        this._renderFilmsSection();
        break;
      }
      case UpdateType.PATCH: {
        this._initFilmCardPresenter(this._filmCardPresenter, data);
        this._initFilmCardPresenter(this._ratedFilmCardPresenter, data);
        this._initFilmCardPresenter(this._commentedFilmCardPresenter, data);
        break;
      }
      case UpdateType.MINOR: {
        this._clearFilmList({ resetFilmCounter: true });
        this._renderFilmsSection();
        break;
      }
      case UpdateType.MAJOR: {
        this._clearFilmList({ resetFilmCounter: true, resetSortType: true });

        switch (this._currentScreen) {
          case TypeList.FILMS: {
            this._renderFilmsSection();
            break;
          }
          case TypeList.STATS: {
            this._currentStatsFilter = FilterType.ALL;
            this._renderStatsScreen(filteredFilms);
            break;
          }
        }
        break;
      }
    }
  }

  _cardModeChangeHandler() {
    this._filmCardPresenter.forEach((presenter) => presenter.resetView());
    this._ratedFilmCardPresenter.forEach((presenter) => presenter.resetView());
    this._commentedFilmCardPresenter.forEach((presenter) => presenter.resetView());
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList({ resetFilmCounter: true });
    this._renderFilmsSection();
  }

  _renderStatsScreen(films) {
    this._statsComponent = new Statistic(
      this._currentProfileRating,
      this._currentStatsFilter,
      films,
    );

    this._statsComponent.setFilterTypeChangeHandler(this._statsFilterChangeHandler);
    render(this._mainContainer, this._statsComponent, RenderPosition.BEFOREEND);
  }

  _statsFilterChangeHandler(value) {
    const films = this._filmsModel.getFilms();
    const filteredFilms= filter[FilterType.HISTORY](films);
    this._currentStatsFilter = value;

    removeComponent(this._statsComponent);

    switch (this._currentStatsFilter) {
      case StatsTime.ALL: {
        this._renderStatsScreen(filteredFilms);
        break;
      }
      case StatsTime.TODAY: {
        this._renderStatsScreen(filterStatsByWatchingDate(filteredFilms, 'd'));
        break;
      }
      case StatsTime.WEEK: {
        this._renderStatsScreen(filterStatsByWatchingDate(filteredFilms, 'w'));
        break;
      }
      case StatsTime.MONTH: {
        this._renderStatsScreen(filterStatsByWatchingDate(filteredFilms, 'M'));
        break;
      }
      case StatsTime.YEAR: {
        this._renderStatsScreen(filterStatsByWatchingDate(filteredFilms, 'y'));
        break;
      }
    }
  }

  _renderLoading() {
    render(this._filmsSection, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderSortFilmList() {
    if (this._sortFilmListComponent !== null) {
      this._sortFilmListComponent = null;
    }

    this._sortFilmListComponent = new SortFilmList(this._currentSortType);

    if (this._getFilms().length) {
      render(this._mainContainer, this._sortFilmListComponent, RenderPosition.BEFOREEND);
      this._sortFilmListComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    }
  }

  _renderEmptyFilmsMessage() {
    removeComponent(this._filmsList);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);

    this._emptyListComponent = new EmptyList(this._filterType);
    render(this._filmsSection, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButton();

    render(this._filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setLoadMoreClickHandler(this._showMoreFilmsClickHandler);
  }

  _showMoreFilmsClickHandler() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(
      filmsCount,
      this._renderedFilmsCount + FILM_CARD,
    );
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilmCards(this._filmsListContainer, films, this._filmCardPresenter);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      removeComponent(this._showMoreButtonComponent);
    }
  }


  _renderDataFilmsCounter() {
    render(this._footerContainer, this._footerStatsComponent, RenderPosition.BEFOREEND);
  }

  _clearCardPresenter(filmCardPresenter) {
    filmCardPresenter.forEach((presenter) => presenter.destroy());
    filmCardPresenter.clear();
  }

  _clearFilmList({ resetFilmCounter = false, resetSortType = false } = {}) {
    const filmsCount = this._getFilms().length;

    this._clearCardPresenter(this._filmCardPresenter);
    this._clearCardPresenter(this._ratedFilmCardPresenter);
    this._clearCardPresenter(this._commentedFilmCardPresenter);

    if (this._statsComponent) {
      removeComponent(this._statsComponent);
    }

    removeComponent(this._sortFilmListComponent);

    if (this._emptyListComponent) {
      removeComponent(this._emptyListComponent);
    }

    removeComponent(this._loadingComponent);
    removeComponent(this._showMoreButtonComponent);
    removeComponent(this._filmsList);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);

    if (resetFilmCounter) {
      this._renderedFilmsCount = FILM_CARD;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
export default FilmsPresenter;
