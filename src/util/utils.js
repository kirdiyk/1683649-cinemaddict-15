import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);
import { ALL_FILMS, MAX_DESCRIPTION } from './const';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { TimeFormat, FilterType, TIME, ProfileRank } from './const.js';

dayjs.extend(relativeTime);

export const getRelativeTimeFromDate = (date) => dayjs(date).fromNow();

export const getFormatDate = (date, format) => dayjs(date).format(format);

export const sliceDescription = (text) => text.length >= MAX_DESCRIPTION ? `${text.slice(0, MAX_DESCRIPTION)}...` : text;

export const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const getTotalTimeFilms = (films, format) => {
  const totalDuration = films.reduce((acc, rec) => acc + rec.runtime, 0);

  switch (format) {
    case TimeFormat.HOUR: {
      return dayjs.duration(totalDuration, 'm').format('H');
    }
    case TimeFormat.MINUTE: {
      return dayjs.duration(totalDuration, 'm').format('m');
    }
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
  const counts = [];

  countGenres(films).forEach((genre) => counts.push(genre.count));

  return counts;
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
    case isNoviceRank: {
      return ProfileRank.NOVICE;
    }
    case isFanRank: {
      return ProfileRank.FAN;
    }
    case isMovieBuffRank: {
      return ProfileRank.MOVIE_BUFF;
    }
    default: {
      return '';
    }
  }
};

export const isOnline = () => window.navigator.onLine;

export const filterStatsByWatchingDate = (films, period) => {
  const deadline = dayjs().subtract(TIME, period);
  return films.filter((movie) => dayjs(movie.watchingDate).diff(deadline, 'minute') > 0);
};
