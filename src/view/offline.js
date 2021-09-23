import Abstract from './abctract.js';

const createMessageTemplate = (text) => (
  `<div class="notification">
    <p class="notification__text">
      ${text}
    </p>
    <svg class="notification__spinner" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#31353f" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
        </circle>
        <!-- [ldio] generated by https://loading.io/ -->
    </svg>
  </div>`
);

class Offline extends Abstract {
  constructor(textMessage) {
    super();

    this._textMessage = textMessage;
  }

  getTemplate() {
    return createMessageTemplate(this._textMessage);
  }

  removeElement() {
    super.removeElement();
    const notification = document.querySelector('.notification');
    if (notification) {
      notification.remove();
    }
  }
}
export default Offline;
