import FilmModel from './model/film-model.js';
import FilterModel from './model/filter-model.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FooterStats from './view/footer-stats.js';
import SiteManagment from './site-management.js';
import { END_POINT, AUTHORIZATION, UpdateType, RenderPosition, STORE_NAME, OFFLINE_MESSAGE} from './util/const.js';
import API from './api.js';
import { isOnline } from './util/utils.js';
import { render } from './util/render.js';
import Store from './store.js';
import Offline from './view/offline.js';

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const managerAPI = new SiteManagment(api, store);

const message = new Offline(OFFLINE_MESSAGE);

const filmsModel = new FilmModel();
const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

new FilterPresenter(siteHeaderElement, siteMainElement, filterModel, filmsModel).init();
new FilmsPresenter(siteMainElement, siteFooterElement, filmsModel, filterModel, managerAPI).init();

if (!isOnline()) {
  render(document.body, message, RenderPosition.BEFOREEND);
} else {
  message.removeElement();
}

managerAPI.getFilmsData()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(
      siteFooterElement,
      new FooterStats(filmsModel.getFilms()),
      RenderPosition.BEFOREEND,
    );
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(siteFooterElement, new FooterStats(), RenderPosition.BEFOREEND);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('../public/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  managerAPI.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  render(document.body, message, RenderPosition.BEFOREEND);
});


