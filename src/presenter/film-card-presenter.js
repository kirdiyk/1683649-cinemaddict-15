import { removeComponent, render, replace } from '../util/render';
import { RenderPosition, CardMode, UserAction, UpdateType, FilterType } from '../util/const.js';
import FilmCard from '../view/film-card.js';
import FilmDetail from '../view/film-popup.js';
import CommentModel from '../model/comment-model.js';
import { isOnline } from '../util/utils.js';

class FilmCardPresenter {
  constructor(filmContainer, changeData, changeMode, filterType, api) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filterType = filterType;
    this._api = api;

    this._filmPopupComponent = null;
    this._filmCardComponent = null;
    this._commentsModel = new CommentModel();

    this._switchViewedClickHandler = this._switchViewedClickHandler.bind(this);
    this._switchFavoriteClickHandler = this._switchFavoriteClickHandler.bind(this);
    this._switchWatchlistClickHandler = this._switchWatchlistClickHandler.bind(this);
    this._closePopupEscKeyHandler = this._closePopupEscKeyHandler.bind(this);
    this._hidePopup = this._hidePopup.bind(this);

    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);

    this._mode = CardMode.CLOSE;
    this.body = document.querySelector('body');
  }

  init(film) {
    this._film = film;

    this._api.getCommentsList(this._film).then((response) => {
      if (this._film.comments) {
        this._commentsModel.setComments(response);
      }
    }).catch(() => {
      this._commentsModel.setComments([]);
    });

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCard(film);
    this._filmCardComponent.setFilmCardClickHandler(() => this._renderFilmPopup(
      film,
      this._commentsModel.getComments(),
    ));
    this._filmCardComponent.setViewedClickHandler(this._switchViewedClickHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._switchFavoriteClickHandler);
    this._filmCardComponent.setWatchlistClickHandler(this._switchWatchlistClickHandler);

    if (prevFilmCardComponent === null) {
      render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    removeComponent(prevFilmCardComponent);
  }

  resetView() {
    if (this._mode !== CardMode.CLOSE) {
      this._hidePopup();
    }
  }

  destroy() {
    removeComponent(this._filmCardComponent);
  }

  _renderFilmPopup(film) {
    if (this._filmPopupComponent) {
      this._hidePopup();
    }

    if (this._filmPopupComponent !== null) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
      this._filmPopupComponent = null;
    }

    this._filmPopupComponent = new FilmDetail(film, this._commentsModel.getComments());

    this._showPopup();
    this.body.classList.add('hide-overflow');
    this._filmPopupComponent.getElement().scrollTo(0, this._scrollPosition);

    this._filmPopupComponent.setClosePopupClickHandler(this._hidePopup);
    this._filmPopupComponent.setViewedClickHandler(this._switchViewedClickHandler);
    this._filmPopupComponent.setFavoriteClickHandler(this._switchFavoriteClickHandler);
    this._filmPopupComponent.setWatchlistClickHandler(this._switchWatchlistClickHandler);
    this._filmPopupComponent.setCommentDeleteClickHandler(this._commentDeleteClickHandler);
    this._filmPopupComponent.setCommentSubmitHandler(this._commentSubmitHandler);
  }

  _hidePopup() {
    removeComponent(this._filmPopupComponent);
    document.removeEventListener('keydown', this._closePopupEscKeyHandler);
    this.body.classList.remove('hide-overflow');
    this._filmPopupComponent = null;
    this._mode = CardMode.CLOSE;
  }

  _showPopup() {
    render(this.body, this._filmPopupComponent, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this._closePopupEscKeyHandler);
    this._changeMode();
    this._mode = CardMode.OPEN;
  }

  _closePopupEscKeyHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._filmPopupComponent.getElement().querySelector('.film-details__inner').reset();
      this._hidePopup();
    }
  }

  _switchViewedClickHandler() {
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    const currentFilterType = this._filterType === FilterType.ALL || this._filterType !== FilterType.HISTORY;
    const isAlreadyViewed = this._film.isViewed;

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }
    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isViewed: !this._film.isViewed,
        wathingDate: isAlreadyViewed ? new Date() : null,
      },
    );
  }

  _switchFavoriteClickHandler() {
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }
    const currentFilterType = this._filterType === FilterType.ALL || this._filterType !== FilterType.FAVORITES;

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isFavorite: !this._film.isFavorite,
      },
    );
  }

  _switchWatchlistClickHandler() {
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    const currentFilterType = this._filterType === FilterType.ALL || this._filterType !== FilterType.WATCHLIST;

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isWatchlist: !this._film.isWatchlist,
      },
    );
  }

  _commentDeleteClickHandler(id, button, buttonList) {
    if (!isOnline()) {
      this._filmPopupComponent.shake();
      return;
    }

    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }
    button.textContent = 'Deleting...';
    buttonList.forEach((btn) => {
      btn.disabled = true;
    });

    this._api.deleteComment(id).then(() => {
      this._changeData(
        UserAction.UPDATE_POPUP,
        UpdateType.PATCH,
        this._film,
      );
    }).catch(() => {
      this._filmPopupComponent.shake();
      button.textContent = 'Delete';
      buttonList.forEach((btn) => {
        btn.disabled = false;
      });
    });
  }

  _commentSubmitHandler(data, input, emotionList) {
    if (!isOnline()) {
      this._filmPopupComponent.shake();
      return;
    }

    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    if (!data.commentText || !data.emotion) {
      this._filmPopupComponent.shake();
      return;
    }

    const newComment = {
      emotion: data.emotion,
      comment: data.commentText,
    };

    input.setAttribute('disabled', 'disabled');
    emotionList.forEach((emotionItem) => {
      emotionItem.disabled = true;
    });

    this._api.addComment(this._film, newComment).then((response) => {
      this._commentsModel.addComment(response);
    })
      .then(() => {
        this._changeData(
          UserAction.UPDATE_POPUP,
          UpdateType.PATCH,
          this._film,
        );
      })
      .catch(() => {
        input.removeAttribute('disabled');
        emotionList.forEach((emotionItem) => {
          emotionItem.disabled = false;
        });
        this._filmPopupComponent.shake();
      });
  }

  updateComments() {
    this._api.getCommentsList(this._film).then((response) => {
      this._commentsModel.setComments(response);
      this._renderFilmPopup(this._film, this._commentsModel.getComments());
      this._filmPopupComponent.getElement().scrollTo(0, this._scrollPosition);
    });
  }

  rerenderPopup() {
    if (this._filmPopupComponent) {
      this._renderFilmPopup(this._film, this._commentsModel.getComments());
      this._filmPopupComponent.getElement().scrollTo(0, this._scrollPosition);
    }
  }

  setShakeState() {
    if (this._filmPopupComponent) {
      this._filmPopupComponent.shake();
    } else {
      this._filmCardComponent.shake();
    }
  }

}
export default FilmCardPresenter;

