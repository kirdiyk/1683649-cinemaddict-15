import Abstract from './abctract.js';
import { SortType } from '../util/utils.js';

const createSortFilmListTemplate = (activeSortType) => (
  `<ul class="sort">
    <li>
      <a href="#" class="sort__button ${activeSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">
        Sort by default
      </a>
    </li>
    <li>
      <a href="#" class="sort__button ${activeSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">
        Sort by date
      </a>
    </li>
    <li>
      <a href="#" class="sort__button ${activeSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">
        Sort by rating
      </a>
    </li>
  </ul>`
);

class SortFilmList extends Abstract {
  constructor(activeSortType) {
    super();

    this._activeSortType = activeSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortFilmListTemplate(this._activeSortType);
  }

  _sortTypeChangeHandler(evt) {
    const target = evt.target;

    if (target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
export default SortFilmList;
