import { BAR_SIZE, TimeFormat} from '../util/const.js';
import { getGenres, getGenresCount, getTopGenre, getTotalTimeFilms } from '../util/utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Abstract from './abctract';

const renderGenresChart = (statisticCtx, films) => new Chart(statisticCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: Array.from(getGenres(films)),
    datasets: [{
      data: getGenresCount(films),
      backgroundColor: '#ffe800',
      hoverBackgroundColor: '#ffe800',
      anchor: 'start',
      barThickness: 30,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20,
        },
        color: '#ffffff',
        anchor: 'start',
        align: 'start',
        offset: 40,
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#ffffff',
          padding: 100,
          fontSize: 20,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const createStatisticTemplate = (rating, currentFilter, films) => (
  `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rating}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-all-time"
        value="${TimeFormat.ALL}"
        ${currentFilter === TimeFormat.ALL ? 'checked' : ''}
      >
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-today"
        value="${TimeFormat.TODAY}"
        ${currentFilter === TimeFormat.TODAY ? 'checked' : ''}
      >
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-week"
        value="${TimeFormat.WEEK}"
        ${currentFilter === TimeFormat.WEEK ? 'checked' : ''}
      >
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-month"
        value="${TimeFormat.MONTH}"
        ${currentFilter === TimeFormat.MONTH ? 'checked' : ''}
      >
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-year" value="${TimeFormat.YEAR}"
        ${currentFilter === TimeFormat.YEAR ? 'checked' : ''}
      >
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">
          ${films.length}
        <span class="statistic__item-description">
          ${films.length > 1 ? 'movies' : 'movie'}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
      ${getTotalTimeFilms(films, TimeFormat.DAY) > 0 ?
    `${getTotalTimeFilms(
      films,
      TimeFormat.DAY,
    )} <span class="statistic__item-description">d</span>` : ''}
      ${getTotalTimeFilms(films, TimeFormat.HOUR) > 0 ? `${getTotalTimeFilms(
    films,
    TimeFormat.HOUR,
  )}
       <span class="statistic__item-description">h</span>` : ''}
        ${getTotalTimeFilms(films, TimeFormat.MINUTE)}
        <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${films.length ? getTopGenre(films) : ''}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas
        class="statistic__chart"
        width="1000"
        height="${BAR_SIZE * getGenres(films).size}"
      >
      </canvas>
    </div>
  </section>
`);

export default class StatsScreen extends Abstract {
  constructor(rating, currentFilter, films) {
    super();

    this._rating = rating;
    this._currentFilter = currentFilter;
    this._films = films;

    this._statisticCart = null;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._setChart();
  }

  removeElement() {
    super.removeElement();

    if (this._statisticCart !== null) {
      this._statisticCart = null;
    }
  }

  getTemplate() {
    return createStatisticTemplate(this._rating, this._currentFilter, this._films);
  }

  _getScrollPositon() {
    return this.getElement().scrollTop;
  }

  _setScrollPosition(value) {
    this.getElement().scrollTop = value;
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    const scroll = this._getScrollPositon();

    this._callback.filterTypeChange(evt.target.value);
    this._setScrollPosition(scroll);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('click', this._filterTypeChangeHandler);
  }

  _setChart() {
    if (this._statisticCart !== null) {
      this._statisticCart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._statisticCart = renderGenresChart(statisticCtx, this._films);
  }
}

