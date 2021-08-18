import {createSiteMenuTemplate} from './view/site-menu.js';
import { createCardFilmTemplate } from './view/card-film.js';
import { createFilmDetailsTemplate } from './view/details-film.js';
import { createFilmListExtraTemplate } from './view/extra-list-film.js';
import { showMoreButtonTemplate } from './view/button-more.js';
import { profileTemplate } from './view/prodile-user.js';
import { createFilmListTemplate } from './view/list-film.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

const FILM_CARD = 5;
const FILM_CARD_EXTRA = 2;

const render = (template, container, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmCards = (cardsCount, container) => {
  for (let i = 0; i < cardsCount; i++) {
    render(createCardFilmTemplate (), container);
  }
};

render(createSiteMenuTemplate(), siteMainElement);
render(profileTemplate(), siteHeaderElement);
render( createFilmListTemplate(), siteMainElement);

const siteFilmsContainer = siteMainElement.querySelector('.films');

render(createFilmListExtraTemplate(), siteFilmsContainer);
render(createFilmListExtraTemplate(), siteFilmsContainer);

const siteFilmListContainer = siteMainElement.querySelector('.films-list__container');

renderFilmCards(FILM_CARD, siteFilmListContainer);

const siteFilmListElement = siteMainElement.querySelector('.films-list');
render(showMoreButtonTemplate(), siteFilmListElement);

const siteFilmListExtraContainer = [...siteFilmsContainer.querySelectorAll('.films-list--extra')];
siteFilmListExtraContainer.forEach((item) => {
  const container = item.querySelector('.films-list__container');
  renderFilmCards(FILM_CARD_EXTRA, container);
});


render(createFilmDetailsTemplate(), siteFooterElement, 'afterend');
