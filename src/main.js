import { generateCommentsData, generateFilmData} from './mock/film-card-mock.js';
import { generateFilmsFilter } from './mock/film-card-mock.js';
import Films from './presentor/films-presentor.js';
import { ALL_FILMS } from './util/const.js';
import { getRandomInteger } from './util/utils.js';

const films = Array.from({length:ALL_FILMS}, () => generateFilmData());
const comments = Array.from({length: getRandomInteger(3, 20)}, () => generateCommentsData());
const filters = generateFilmsFilter(films);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

new Films(siteHeaderElement, siteMainElement, siteFooterElement, filters).init(films, comments);
