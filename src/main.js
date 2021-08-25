import { generateCommentsData, generateFilmData} from './mock/film-card-mock.js';
import { filmCommentTemplate } from './view/film-commted.js';
import { createSiteMenuTemplate } from './view/site-menu.js';
import { createCardFilmTemplate } from './view/card-film.js';
import { filmControlsTemplate } from './view/film-controls.js';
import { createFilmDetailsTemplate } from './view/details-film.js';
import { createFilmListExtraTemplate } from './view/extra-list-film.js';
import { filmListCommentedTemplate } from './view/film-list-commented.js';
import { showMoreButtonTemplate } from './view/button-more.js';
import { profileTemplate } from './view/prodile-user.js';
import { createFilmListTemplate } from './view/list-film.js';
import { FILM_CARD, ALL_FILMS, TOP_RATED } from './util/const.js';
import { createCommentTemplate } from './view/add-film-comment.js';
//import { generateComment } from './mock/comment.js';
import { getRandomInteger } from './util/utils.js';

const getFilmsMock = Array.from({length:ALL_FILMS}, () => generateFilmData()); //.fill().map();//() => generateFilmData());

const films = getFilmsMock;

const getFilterData = (filmList) => {
  const watchList = [];
  const historyList = [];
  const favoriteList = [];

  filmList.forEach((film) => {
    if (film.watchlist) {
      watchList.push(film);
    }

    if (film.alreadyWatched) {
      historyList.push(film);
    }

    if (film.favorite) {
      favoriteList.push(film);
    }
  });

  return {
    watchList,
    historyList,
    favoriteList,
  };
};

const filterData = getFilterData(films);

const comments = Array.from({length: getRandomInteger(3, 20)}, () => generateCommentsData());//.fill('').map(generateComment);


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');


const render = (template, container, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

// const renderFilmCards = (cardsCount, container) => {
//   for (let i = 0; i < cardsCount; i++) {
//     render(createCardFilmTemplate (), container);
//   }
// };

render(createSiteMenuTemplate(filterData), siteMainElement);
render(profileTemplate(), siteHeaderElement);
render( createFilmListTemplate(), siteMainElement);

const siteFilmsContainer = siteMainElement.querySelector('.films');

render(createFilmListExtraTemplate(), siteFilmsContainer);
render(filmListCommentedTemplate, siteFilmsContainer);

const siteFilmListContainer = siteMainElement.querySelector('.films-list__container');

const j = Math.min(films.length, FILM_CARD);
for (let i = 0; i < j; i++) {
  render(createCardFilmTemplate(films[i]), siteFilmListContainer);
}

//renderFilmCards(FILM_CARD, siteFilmListContainer);

const siteFilmListElement = siteMainElement.querySelector('.films-list');
if (films.length > FILM_CARD) {
  let renderedFilmsCount = FILM_CARD;

  render(showMoreButtonTemplate(), siteFilmListElement);

  const showMoreButton = siteFilmListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD)
      .forEach((film) => render(createCardFilmTemplate(film), siteFilmListContainer));

    renderedFilmsCount += FILM_CARD;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const siteFilmListExtraContainer = [...siteFilmsContainer.querySelectorAll('.films-list--extra')];

const ratedFilms = films
  .filter((film) => film.rating > TOP_RATED)
  .sort((a, b) => (b.rating > a.rating) ? 1 : -1)
  .slice(0, 2);

const commentedFilms = films
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, 2);

const containerRatedFilm = siteFilmListExtraContainer[0].querySelector('.films-list__container');
ratedFilms.forEach((film) => {
  render(createCardFilmTemplate(film), containerRatedFilm);
});

const containerCommentedFilm = siteFilmListExtraContainer[1].querySelector('.films-list__container');
commentedFilms.forEach((film) => {
  render(createCardFilmTemplate(film), containerCommentedFilm);
});

render(createFilmDetailsTemplate(films[0]), siteFooterElement, 'afterend');

const filmDetailsContainer = document.querySelector('.film-details__inner');

render(filmControlsTemplate(films[0]), filmDetailsContainer);

render(filmCommentTemplate(films[0], comments), filmDetailsContainer);

const filmCommentsWrapper = document.querySelector('.film-details__comments-wrap');

render(createCommentTemplate(), filmCommentsWrapper);
