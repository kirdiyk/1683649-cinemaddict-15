import { generateFilmData} from './mock/film-card-mock.js';
import { generateCommentsData } from './mock/comment.js';
import { generateFilmsFilter } from './mock/film-card-mock.js';
import FilmModel from './model/film-model.js';
import FilterModel from './model/filter-model.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { ALL_FILMS } from './util/const.js';

const filmsModel = new FilmModel();
const filterModel = new FilterModel();

const films = Array.from({length:ALL_FILMS}, () => generateFilmData());
const comments = films.map((film) => generateCommentsData(film));
const filters = generateFilmsFilter(films);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

new FilmsPresenter(siteHeaderElement, siteMainElement, siteFooterElement, filters).init(films, comments);
new FilterPresenter(siteHeaderElement, siteMainElement, filterModel, filmsModel).init();
