import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);
import { MAX_DESCRIPTION } from './const';

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

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const removeDOMElement = (className) => document.querySelector(className).remove();


