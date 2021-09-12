import Abstract from './abctract.js';

export const createProfileTemplate = () => (
  `<section class="header__profile profile">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserProfile extends Abstract {
  constructor(watchedFilms) {
    super();

    this._watchedFilms = watchedFilms;
  }

  getTemplate() {
    return createProfileTemplate(this._watchedFilms);
  }
}
