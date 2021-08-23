import { getRandomFloat,getRandomInteger,getRandomArrayElement,getRandomDate} from '../util/utils.js';

const emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const getText = () => `Моя оценка ${getRandomFloat(0, 10, 1)}`;

const getAuthor = () => `ID пользователя ${getRandomInteger(1, 19879)}`;

export const generateComment = () => (
  {
    emotions: getRandomArrayElement(emotions),
    date: getRandomDate(),
    author: getAuthor(),
    text: getText(),
  }
);
