import {getRandomArrayElement, getRandomIntegerInRangeWithFloat, getRandomArrayInRange, getRandomInteger} from '../util/utils.js';

const generateTitle = () => {
  const titles = [
    'Miracle on 34th Street',
    'The Terminal',
    'A Most Violent Year',
    'The Matrix',
    'Indiana Jones and the Temple of Doom',
    'Shrek',
    'Front of the Class',
    'The Cloverfield Paradox',
    'Mary and Max',
    'American Beauty',
    'The Calling',
    'Titanic',
    'The Simpsons Movie',
    'The Ghost Writer',
  ];

  return titles[getRandomArrayElement(0, titles.length - 1)];
};

const generatePosters = () => {
  const posters = [
    'images/posters/made-for-each-other.png',
    'images/posters/popeye-meets-sinbad.png',
    'images/posters/sagebrush-trail.jpg',
    'images/posters/santa-claus-conquers-the-martians.jpg',
    'images/posters/the-man-with-the-golden-arm.jpg',
  ];

  return posters[getRandomArrayElement(0, posters.length - 1)];
};

const generateCountry = () => {
  const country = [
    'UK',
    'RU',
    'KZ',
    'UA',
    'USA',
    'DE',
    'PL',
    'GB',
  ];

  return country[getRandomArrayElement(0, country.length - 1)];
};

const generateActors = () => {
  const actors = [
    'Glenn Close',
    'Al Pacino',
    'Judi Dench',
    'Robert De Niro',
    'Leonardo DiCaprio',
  ];

  return getRandomArrayElement(actors, actors.length);
};

const generateGenres = () =>{
  const genres = [
    'Action',
    'Animation',
    'Comedy',
    'Family',
    'Horror',
    'Carton',
    'Suspense',
  ];

  return getRandomArrayElement(genres, genres.length);
};

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Cras aliquet varius magna, non porta ligula feugiat eget',
    'Fusce tristique felis at fermentum pharetra',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
    'Sed sed nisi sed augue convallis suscipit in sed felis',
    'Aliquam erat volutpat',
    'Nunc fermentum tortor ac porta dapibus',
    'In rutrum ac purus sit amet tempus',
  ];

  return getRandomArrayInRange(descriptions, 5).join('. ');
};

const generateDirectors = () => {
  const directors = [
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil',
  ];

  return getRandomArrayElement(directors , directors .length);
};

const generateData = () => {
  const year = getRandomArrayElement(2000, 2021);
  const month = getRandomArrayElement(1, 12);
  const day = getRandomArrayElement(1, 30);

  return [year, month, day].join('-');
};

const generateCounters = () => ({
  isViewed: Boolean(getRandomArrayElement(0, 1)),
  isFavorite: Boolean(getRandomArrayElement(0, 1)),
  inWatchlist: Boolean(getRandomArrayElement(0, 1)),
});

const generateAge = () => {
  const ageList = [13, 16, 18];

  return ageList[getRandomArrayElement(0, ageList.length - 1)];
};

const filmFilterMap = {
  'All movies': (films) => films.filter((film) => film),
  'Watchlist': (films) => films
    .filter((film) => film.userInfo.inWatchlist).length,
  'History': (films) => films
    .filter((film) => film.userInfo.isViewed).length,
  'Favorites': (films) => films
    .filter((film) => film.userInfo.isFavorite).length,
};

export const generateFilmsFilter = (films) => Object.entries(filmFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);

export const generateCommentsData = () => {
  const generateCommentId = () => {
    const id = [];

    for (let i = 1; i < 20; i++) {
      id.push(i);
    }

    return id[getRandomInteger(0, id.length - 1)];
  };

  const generateAuthor = () => {
    const authors = [
      'Pop',
      'Bob',
      'Rob',
      'Cott',
      'Morg',
      'Dog',
    ];

    return authors[getRandomInteger(0, authors.length - 1)];
  };


  const generateComments = () => {
    const comments = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      'Cras aliquet varius magna, non porta ligula feugiat eget',
      'Fusce tristique felis at fermentum pharetra',
      'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
      'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
      'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
      'Sed sed nisi sed augue convallis suscipit in sed felis',
      'Aliquam erat volutpat',
      'Nunc fermentum tortor ac porta dapibus',
      'In rutrum ac purus sit amet tempus',
    ];

    return comments[getRandomInteger(0, comments.length - 1)];
  };

  const generateEmoji = () => {
    const emoji = ['smile', 'sleeping', 'puke', 'angry'];

    return emoji[getRandomInteger(0, emoji.length - 1)];
  };

  const generateCommentDate = () => {
    const dates = [
      '2013-01-01T01:05:13.554Z',
      '2014-02-02T20:01:54.554Z',
      '2015-03-03T11:12:34.554Z',
      '2016-04-13T17:10:55.554Z',
      '2017-05-16T19:16:32.554Z',
      '2018-06-06T11:09:22.554Z',
      '2019-07-10T16:12:32.554Z',
      '2020-08-11T16:12:11.554Z',
    ];

    return dates[getRandomInteger(0, dates.length - 1)];
  };

  return {
    id: generateCommentId(),
    author: generateAuthor(),
    text: generateComments(),
    emoji: generateEmoji(),
    date: generateCommentDate(),
  };
};

const createComments = () => {
  const comments = [];

  for (let i = 1; i < 7; i++) {
    comments.push(i);
  }

  return getRandomArrayInRange(comments, comments.length - 1);
};

export const generateFilmData = () => ({
  title: generateTitle(),
  poster: generatePosters(),
  description: generateDescription(),
  rating: getRandomIntegerInRangeWithFloat(0, 10),
  genres: generateGenres(),
  date: {
    releaseDate: generateData(),
    runtime: getRandomArrayElement(40, 350),
  },
  details: {
    age: generateAge(),
    originalTitle: generateTitle(),
    director: generateDirectors(),
    writers: 'Rikten',
    actors: generateActors(),
    country: generateCountry(),
  },
  watchlist: Boolean(getRandomInteger(0, 1)),
  //history: Boolean(getRandomInteger(0, 1)),
  favorite: Boolean(getRandomInteger(0, 1)),
  comments: createComments(),
  userInfo: generateCounters(),
});

