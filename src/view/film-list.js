import Abstract from './abctract.js';

const createFilmListTemplate = () =>
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>`;

class FilmList extends Abstract {
  getTemplate() {
    return createFilmListTemplate();
  }
}

export default FilmList;
