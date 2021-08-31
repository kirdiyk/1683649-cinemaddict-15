import { RenderPosition } from './const.js';
import AbstractClass from '../view/abctract.js';

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (child, container, place = RenderPosition.BEFOREEND, arg = {}) => {
  if (container instanceof AbstractClass) {
    container = container.renderElement();
  }

  if (child instanceof AbstractClass) {
    child = child.renderElement(arg);
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.AFTEREND:
      container.after(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const removeComponent = (component) => {
  if (!(component instanceof AbstractClass)) {
    throw new Error('Can remove only components');
  }

  component.renderElement().remove();
  component.removeElement();
};
