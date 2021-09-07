import Abstract from './abctract';

const createEmptyListTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

export default class EmptyList extends Abstract {
  getTemplate() {
    return createEmptyListTemplate();
  }
}
