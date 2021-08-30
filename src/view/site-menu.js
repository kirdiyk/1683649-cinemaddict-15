import { createElement } from '../util/utils.js';

const createSiteMenuTemplate =  (filterData) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist
        <span class="main-navigation__item-count">${filterData.watchList.length}</span></a>

      <a href="#favorites" class="main-navigation__item">Favorites
        <span class="main-navigation__item-count">${filterData.favoriteList.length}</span>
      </a>
    </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class mainMenuClass {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }

  renderElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
