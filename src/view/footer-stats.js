import Abstract from './abctract.js';

const createFooterStatsTemplate = (films = []) => (
  `<section class="footer__statistics">
    <p>${films.length ? films.length : 0} movies inside</p>
  </section>`
);

class FooterStats extends Abstract {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._films);
  }
}

export default FooterStats;
