export const MAX_LENGTH = 139;
export const FILM_CARD = 5;
export const FILM_CARD_EXTRA = 2;
export const MAX_DESCRIPTION = 139;
export const ALL_FILMS = 20;
export const TOP_RATED = 8;
export const BAR_SIZE = 50;
export const TIME = 1;
export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

export const CardMode = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATS: 'Stats',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  CHANGE_FILTER: 'CHANGE_FILTER',
};

export const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const TimeFormat = {
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day',
};

export const ProfileRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const AUTHORIZATION = 'Basic eo0w83hik29889a';
export const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

export const TypeList = {
  FILMS: 'films',
  STATS: 'stats',
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const StatsTime = {
  ALL: 'all-time',
  YEAR: 'year',
  MONTH: 'month',
  WEEK: 'week',
  TODAY: 'today',
};

export const STORE_PREFIX = 'cinemaddict-localstorage';
export const STORE_VER = 'v15';
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
export const OFFLINE_MESSAGE = 'No network access';

export const REACTIONS = ['angry', 'sleeping', 'puke', 'smile'];
export const SHAKE_TIMEOUT = 700;
