export const filmControlsTemplate = (film) => {
  const { userInfo } = film;

  const watchlistClass = userInfo.inWatchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const viewedClass = userInfo.isViewed
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClass = userInfo.isFavorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  return `
  <section class="film-details__controls">
    <button type="button" class="film-details__control-button ${watchlistClass}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button ${viewedClass}" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button ${favoriteClass}" id="favorite" name="favorite">Add to favorites</button>
    </section>
  `;
};
