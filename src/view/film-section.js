import Abstract from './abstract.js';

const createFilmContainerTemplate = () =>
  '<section class="films"></section>';

export default class FilmSection extends Abstract {
  getTemplate() {
    return createFilmContainerTemplate();
  }
}
