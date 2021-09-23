import Abstract from './abctract';

const createFilmContainerTemplate = () =>
  '<section class="films"></section>';

class FilmSection extends Abstract {
  getTemplate() {
    return createFilmContainerTemplate();
  }
}
export default FilmSection;
