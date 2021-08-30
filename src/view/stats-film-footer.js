import AbstractClass from './abctract.js';

const createFooterStatsTemplate = (films) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`
);

export default class FooterStats extends AbstractClass {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._films);
  }
}
