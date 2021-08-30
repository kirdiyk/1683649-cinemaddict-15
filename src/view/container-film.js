import AbstractClass from './abctract.js';

const createFilmContainerTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsContainer extends AbstractClass {
  getTemplate() {
    return createFilmContainerTemplate();
  }
}
