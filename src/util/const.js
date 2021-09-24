const FILM_CARD = 5;
const FILM_CARD_EXTRA = 2;
const MAX_DESCRIPTION = 139;
const ALL_FILMS = 20;
const TOP_RATED = 8;
const BAR_SIZE = 50;
const TIME = 1;
const FILM_RATING_MIN = 4;
const FILM_RATING_MAX = 6;
const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

const CardMode = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATS: 'Stats',
};

const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const TimeFormat = {
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day',
};

const ProfileRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const AUTHORIZATION = 'Basic eo0w83hik29889a';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const TypeList = {
  FILMS: 'films',
  STATS: 'stats',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const StatsTime = {
  ALL: 'all-time',
  YEAR: 'year',
  MONTH: 'month',
  WEEK: 'week',
  TODAY: 'today',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  UPDATE_POPUP: 'UPDATE_POPUP',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const OFFLINE_MESSAGE = 'No network access';

const REACTIONS = ['angry', 'sleeping', 'puke', 'smile'];
const SHAKE_TIMEOUT = 700;

export { MAX_DESCRIPTION, FILM_CARD, FILM_CARD_EXTRA, ALL_FILMS, TOP_RATED, BAR_SIZE, TIME, FILM_RATING_MAX, FILM_RATING_MIN,
  RenderPosition, CardMode, FilterType, UpdateType, TimeFormat, ProfileRank, END_POINT, AUTHORIZATION, TypeList, Method, StatsTime,
  UserAction, STORE_NAME, OFFLINE_MESSAGE, SHAKE_TIMEOUT, REACTIONS};
