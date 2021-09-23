import { createElement } from '../util/render.js';
import { SHAKE_TIMEOUT } from '../util/const.js';

class Abstract {
  constructor() {
    this._element = null;
    this._callback = {};
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake() {
    this.getElement().style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
    }, SHAKE_TIMEOUT);
  }
}

export default Abstract;
