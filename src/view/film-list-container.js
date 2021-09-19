import Abstract from './abctract.js';

const createFilmListTemplate = () => '<div class="films-list__container"></div>';

export default class FilmListContainer extends Abstract {
  getTemplate() {
    return createFilmListTemplate();
  }
}
