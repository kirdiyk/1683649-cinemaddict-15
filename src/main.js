import { generateCommentsData, generateFilmData} from './mock/film-card-mock.js';
import listCommentsClass from './view/film-commted.js';
import mainMenuClass from './view/site-menu.js';
import FilmCard from './view/card-film.js';
import FilmControls from './view/film-controls.js';
import UserProfile from './view/prodile-user.js';
import FilmDetailClass from './view/details-film.js';
import FilmListCommented from './view/film-list-commented.js';
import ShowMoreButton from './view/button-more.js';
import FilmList from './view/list-film.js';
import { FILM_CARD, ALL_FILMS, TOP_RATED } from './util/const.js';
import SortFilmList from './view/sort-menu.js';
import NewComment from './view/add-film-comment.js';
import { getRandomInteger } from './util/utils.js';
import { generateFilmsFilter } from './mock/film-card-mock.js';
import FilmsContainer from './view/container-film.js';
import FilmListRated from './view/popular-film.js';
import EmptyList from './view/empty-list.js';
import Menu from './view/site-menu-list.js';

const films = Array.from({length:ALL_FILMS}, () => generateFilmData());
const comments = Array.from({length: getRandomInteger(3, 20)}, () => generateCommentsData());
const filters = generateFilmsFilter(films);


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

const render = (template, container, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(template);
      break;
    case RenderPosition.AFTEREND:
      container.after(template);
      break;
    case RenderPosition.BEFOREEND:
      container.append(template);
      break;
  }
};

render( new UserProfile().renderElement(), siteHeaderElement);
render( new Menu(filters).renderElement(), siteMainElement);

const menuListElement = document.querySelector('.main-navigation');
const sortFilmListComponent = new SortFilmList();
render(sortFilmListComponent.renderElement(), menuListElement, RenderPosition.AFTEREND);

const filmsContainerComponent = new FilmsContainer();
render(filmsContainerComponent.renderElement(), siteMainElement);

const filmListComponent = new FilmList(filters);
render(filmListComponent.renderElement(), siteMainElement, RenderPosition.BEFOREEND);

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

render(filmListRated.renderElement(), filmsContainerComponent.renderElement());
render(filmListCommented.renderElement(), filmsContainerComponent.renderElement());

const filmPopupComponent = new FilmDetailClass();
const renderFilmPopup = (filmData) => filmPopupComponent.renderElement(filmData);

const renderFilmCard = (container, film) => {
  const filmComponent = new FilmCard(film);
  const filmControlsComponent = new FilmControls(film);
  const commentListComponent = new listCommentsClass(film, comments);
  const newCommentComponent = new NewComment();

  const showFilmPopup = (filmData) => {
    render(renderFilmPopup(filmData), siteFooterElement, RenderPosition.AFTEREND);

    const filmDetailsContainer = filmPopupComponent.renderElement().querySelector('.film-details__inner');
    render(filmControlsComponent.renderElement(), filmDetailsContainer);
    render(commentListComponent.renderElement(), filmDetailsContainer);

    const filmCommentsWrapper = document.querySelector('.film-details__comments-wrap');
    render(filmCommentsWrapper, newCommentComponent.renderElement());

    const closePopupClickHandler = () => {
      document.querySelector('body').classList.remove('hide-overflow');
      filmPopupComponent.removeElement();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopupClickHandler();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);

    filmPopupComponent.renderElement()
      .querySelector('.film-details__close-btn').addEventListener('click', closePopupClickHandler);
  };

  const openPopupClickHandler = () => {
    filmPopupComponent.removeElement();
    showFilmPopup(film);
  };

  filmComponent.renderElement(film).querySelector('.film-card__poster')
    .addEventListener('click', openPopupClickHandler);
  filmComponent.renderElement(film).querySelector('.film-card__title')
    .addEventListener('click', openPopupClickHandler);
  filmComponent.renderElement(film).querySelector('.film-card__comments')
    .addEventListener('click', openPopupClickHandler);

  return render(filmComponent.renderElement(), container);
};

const filmListInner = filmsContainerComponent.renderElement().querySelector('.films-list__container');

const filmsCount = Math.min(films.length, FILM_CARD);
for (let i = 0; i < filmsCount; i++) {
  renderFilmCard(filmListInner, films[i]);
}

const filmListElement = siteMainElement.querySelector('.films-list');

if (films.length > FILM_CARD) {
  let renderedFilmsCount = FILM_CARD;

  render( new ShowMoreButton().renderElement(), filmListElement);

  const showMoreButton = filmListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD)
      .forEach((film) => renderFilmCard(filmListInner, film));

    renderedFilmsCount += FILM_CARD;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const filmListRatedInner = filmListRated.renderElement().querySelector('.films-list__container');
ratedFilms.forEach((film) => {
  renderFilmCard(filmListRatedInner, film);
});

const filmListCommentedInner = filmListCommented.renderElement().querySelector('.films-list__container');
commentedFilms.forEach((film) => {
  renderFilmCard(filmListCommentedInner, film);
});

if (!films.length) {
  mainMenuClass.removeElement();
  filmListRated.removeElement();
  filmListCommented.removeElement();
  filmListComponent.removeElement();
  render(filmsContainerComponent.renderElement(), new EmptyList().renderElement());
}
