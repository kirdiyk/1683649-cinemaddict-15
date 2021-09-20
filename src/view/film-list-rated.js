import Abstract from './abctract.js';

const filmListRatedTemplate = () =>
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
  </section>`;

export default class FilmListRated extends Abstract {
  getTemplate() {
    return filmListRatedTemplate();
  }
}
