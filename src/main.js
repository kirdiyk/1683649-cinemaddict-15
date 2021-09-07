import { generateFilmData} from './mock/film-card-mock.js';
import { generateCommentsData } from './mock/comment.js';
import { generateFilmsFilter } from './mock/film-card-mock.js';
import Films from './presenter/films-presenter.js';
import { ALL_FILMS } from './util/const.js';

const films = Array.from({length:ALL_FILMS}, () => generateFilmData());
const comments = films.map((film) => generateCommentsData(film));
const filters = generateFilmsFilter(films);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

new Films(siteHeaderElement, siteMainElement, siteFooterElement, filters).init(films, comments);
