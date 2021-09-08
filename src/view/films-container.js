import Abstract from './abctract.js';

const createFilmContainerTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsContainer extends Abstract {
  getTemplate() {
    return createFilmContainerTemplate();
  }
}
