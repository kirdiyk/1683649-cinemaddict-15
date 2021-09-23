import AbstractObserver from '../util/abstract-observe.js';
import { FilterType } from '../util/const.js';

class FilterModel extends AbstractObserver {
  constructor() {
    super();

    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
export default FilterModel;
