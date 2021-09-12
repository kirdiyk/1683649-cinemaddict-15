import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);
import { ALL_FILMS, MAX_DESCRIPTION } from './const';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { TimeFormat, FilterType, TIME, ProfileRank } from './const.js';

dayjs.extend(relativeTime);

export const getRelativeTimeFromDate = (date) => dayjs(date).fromNow();

export const getRandomFloat = (min, max, digits = 1) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  const result = Math.random() * (upper - lower) + lower;

  return result.toFixed(digits);
};

export const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

export const getRandomArrayElement = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomIntegerInRangeWithFloat = (min, max, float = 1) => {
  const result = Math.abs(Math.random() * (max - min) + min);

  return result.toFixed(float);
};

export const shuffleArray = (arr) => {
  const copyArray = [...arr];

  for (let i = copyArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copyArray[i], copyArray[j]] = [copyArray[j], copyArray[i]];
  }
  return copyArray;
};

export const getRandomArrayInRange = (arr, maxRange) => {
  const newArray = shuffleArray(arr);

  return newArray.slice(0, getRandomInteger(1, maxRange));
};

export const getFormatDate = (date, format) => dayjs(date).format(format);

export const sliceDescription = (text) => text.length >= MAX_DESCRIPTION ? `${text.slice(0, MAX_DESCRIPTION)}...` : text;

export const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};

export const getRandomDate = (daySpread = -7, monthSpread = -12, yearSpread = -1) => {
  const dayGap = getRandomInteger(daySpread, 0);
  const monthGap = getRandomInteger(monthSpread, 0);
  const yearGap = getRandomInteger(yearSpread, 0);

  return dayjs().add(dayGap, 'day').add(monthGap, 'month').add(yearGap, 'year').toString();
};

export const getListFromArr = (arr) => arr.join();

export const removeDOMElement = (className) => document.querySelector(className).remove();

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const getTotalTimeFilms = (films, format) => {
  const totalDuration = films.reduce((acc, rec) => acc + rec.runtime, 0);

  switch (format) {
    case TimeFormat.HOUR:
      return dayjs.duration(totalDuration, 'm').format('H');
    case TimeFormat.MINUTE:
      return dayjs.duration(totalDuration, 'm').format('m');
  }
};

export const getGenres = (films) => {
  const genres = new Set();

  films.forEach((film) => film.genres.forEach((genre) => genres.add(genre)));

  return genres;
};

export const countGenres = (films) => {
  const allMoviesGenres = [];

  films.forEach((film) => allMoviesGenres.push(...film.genres));

  const genres = [];

  getGenres(films).forEach((genre) =>
    genres.push({
      genre: genre,
      count: allMoviesGenres.filter((allMoviesgenre) => allMoviesgenre === genre).length,
    }),
  );

  return genres;
};

export const getGenresCount = (films) => {
  const count = [];

  countGenres(films).forEach((genre) => count.push(genre.count));

  return count;
};

export const getTopGenre = (films) => {
  const topGenre = countGenres(films);

  topGenre.sort((prev, next) => next.count - prev.count);

  return topGenre[0].genre;
};

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isViewed),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [FilterType.STATS]: (films) => films,
};

export const sortByDate = (firstFilm, secondFilm) => dayjs(secondFilm.releaseDate).diff(dayjs(firstFilm.releaseDate));

export const sortByRating = (firstFilm, secondFilm) => (secondFilm.filmRating > firstFilm.filmRating ? 1 : -1);

export const getUserRating = (watchedCount) => {
  const isNoviceRank = watchedCount > 0 && watchedCount <= ALL_FILMS;
  const isFanRank = watchedCount > ALL_FILMS && watchedCount <= ALL_FILMS;
  const isMovieBuffRank = watchedCount > ALL_FILMS;

  switch (watchedCount) {
    case isNoviceRank:
      return ProfileRank.NOVICE;
    case isFanRank:
      return ProfileRank.FAN;
    case isMovieBuffRank:
      return ProfileRank.MOVIE_BUFF;
    default:
      return '';
  }
};

export const filterStatsByWatchingDate = (films, period) => {
  const deadline = dayjs().subtract(TIME, period);
  return films.filter((movie) => dayjs(movie.watchingDate).diff(deadline, 'minute') > 0);
};
