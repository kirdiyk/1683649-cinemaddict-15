import { generateCommentsData, generateFilmData} from './mock/film-card-mock.js';
import { render, removeComponent } from './util/render.js';
import listCommentsClass from './view/film-commted.js';
import FilmCard from './view/card-film.js';
import FilmControls from './view/film-controls.js';
import UserProfile from './view/prodile-user.js';
import FilmDetailClass from './view/details-film.js';
import FilmListCommented from './view/film-list-commented.js';
import ShowMoreButton from './view/button-more.js';
import FilmList from './view/list-film.js';
import Menu from './view/site-menu-list.js';
import { FILM_CARD, ALL_FILMS, TOP_RATED, RenderPosition } from './util/const.js';
import SortFilmList from './view/sort-menu.js';
import NewComment from './view/add-film-comment.js';
import { getRandomInteger } from './util/utils.js';
import { generateFilmsFilter } from './mock/film-card-mock.js';
import FilmsContainer from './view/container-film.js';
import FilmListRated from './view/popular-film.js';
import EmptyList from './view/empty-list.js';
import FooterStats from './view/stats-film-footer.js';

const films = Array.from({length:ALL_FILMS}, () => generateFilmData());
const comments = Array.from({length: getRandomInteger(3, 20)}, () => generateCommentsData());
const filters = generateFilmsFilter(films);


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

render( new UserProfile(), siteHeaderElement);
render( new Menu(filters), siteMainElement);

const menuListElement = document.querySelector('.main-navigation');
const sortFilmListComponent = new SortFilmList();
render(sortFilmListComponent, menuListElement, RenderPosition.AFTEREND);

const filmsContainerComponent = new FilmsContainer();
render(filmsContainerComponent, siteMainElement);

const filmListComponent = new FilmList();
render(filmListComponent, siteMainElement);


const ratedFilms = films
  .filter((film) => film.rating > TOP_RATED)
  .sort((a, b) => (b.rating > a.rating) ? 1 : -1)
  .slice(0, 2);

const commentedFilms = films
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, 2);

const filmListRated = new FilmListRated();
const filmListCommented = new FilmListCommented();

render(filmListRated, filmsContainerComponent);
render(filmListCommented, filmsContainerComponent);


const filmPopupComponent = new FilmDetailClass();

const renderFilmCard = (container, film) => {
  const filmComponent = new FilmCard(film);
  const filmControlsComponent = new FilmControls(film);
  const commentListComponent = new listCommentsClass(film, comments);
  const newCommentComponent = new NewComment();

  const removeFilmPopup = () => {
    document.querySelector('body').classList.remove('hide-overflow');
    filmPopupComponent.removeElement();
  };

  const renderFilmPopup = (filmData) => {
    render(filmPopupComponent, siteFooterElement,  RenderPosition.AFTEREND,filmData);

    const filmDetailsContainer = filmPopupComponent.renderElement().querySelector('.film-details__inner');
    render(filmControlsComponent, filmDetailsContainer);

    render(commentListComponent, filmDetailsContainer);

    const filmCommentsWrapper = commentListComponent.renderElement().querySelector('.film-details__comments-wrap');
    render(filmCommentsWrapper, newCommentComponent);

    filmPopupComponent.setClosePopupClickHandler(() => {
      removeFilmPopup();
    });

    document.querySelector('body').classList.add('hide-overflow');
  };

  const closePopupEscKeyHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      removeFilmPopup();
    }
  };

  filmComponent.setFilmCardClickHandler(() => {
    document.addEventListener('keydown', closePopupEscKeyHandler);
    removeFilmPopup();

    renderFilmPopup(film);
  });

  return render(filmComponent, container);
};

const filmListInner = filmsContainerComponent.renderElement().querySelector('.films-list__container');

const filmsCount = Math.min(films.length, FILM_CARD);
for (let i = 0; i < filmsCount; i++) {
  renderFilmCard(filmListInner, films[i]);
}

const filmListElement = siteMainElement.querySelector('.films-list');

if (films.length > FILM_CARD) {
  let renderedFilmsCount = FILM_CARD;

  const showMoreButton = new ShowMoreButton();
  render(showMoreButton, filmListElement);


  showMoreButton.setLoadMoreClickHandler(() => {

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD)
      .forEach((film) => renderFilmCard(filmListInner, film));

    renderedFilmsCount += FILM_CARD;

    if (renderedFilmsCount >= films.length) {
      removeComponent(showMoreButton);
    }
  });
}

const filmListRatedInner = filmListRated.renderElement().querySelector('.films-list__container');
ratedFilms.forEach((film) => {
  renderFilmCard(filmListRatedInner, film, RenderPosition.AFTEREND);
});

const filmListCommentedInner = filmListCommented.renderElement().querySelector('.films-list__container');
commentedFilms.forEach((film) => {
  renderFilmCard(filmListCommentedInner, film, RenderPosition.AFTEREND);
});

render(new FooterStats(films), siteFooterElement);

const showEmptyDatabaseMessage = () => {
  removeComponent(sortFilmListComponent);
  removeComponent(filmListRated);
  removeComponent(filmListCommented);
  removeComponent(filmListComponent);

  render(filmsContainerComponent.renderElement(), new EmptyList(), RenderPosition.BEFOREEND);
};

if (!films.length) {
  showEmptyDatabaseMessage();
}
