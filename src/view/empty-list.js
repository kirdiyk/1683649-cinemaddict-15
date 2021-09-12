import Abstract from './abctract.js';
import { FilterType } from '../util/const';

const EmptyListText = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyListTemplate = (filterType) => {
  const emptyListText = EmptyListText[filterType];

  return (
    `<h2 class="films-list__title">${emptyListText}</h2>`
  );
};

export default class EmptyList extends Abstract {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createEmptyListTemplate(this._data);
  }
}

