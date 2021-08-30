import { createElement } from '../util/render.js';

export default class AbstractClass {
  constructor() {
    this._element = null;
    this._callback = {};
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
