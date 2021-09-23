import Abstract from './abctract.js';

const createPreloaderTemplate = () => (
  '<h2 class="films-list__title">Loading...</h2>'
);

class Loader extends Abstract {
  getTemplate() {
    return createPreloaderTemplate();
  }
}
export default Loader;
