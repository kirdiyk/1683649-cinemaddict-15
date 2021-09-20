import Abstract from './abctract.js';

export const createFilmListTemplate = () =>
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>`;

export default class FilmList extends Abstract {
  getTemplate() {
    return createFilmListTemplate();
  }
}
