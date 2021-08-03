import {createSiteMenuTemplate} from './view/site-menu.js';
import { createCardFilmTemplate } from './view/card-film.js';
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');

render(siteMainElement, createSiteMenuTemplate(), 'beforeend');

render(siteMainElement, createCardFilmTemplate(), 'beforeend');
