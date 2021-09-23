import Abstract from './abctract.js';

const createFilmListTemplate = () => '<div class="films-list__container"></div>';

class FilmListContainer extends Abstract {
  getTemplate() {
    return createFilmListTemplate();
  }
}

export default FilmListContainer;
