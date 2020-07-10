import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};



const getData = (points, type) => {
  return points.filter((point) => {
    console.log(point.type, type);
    point.type === type;
  }).length;
};

const renderTransportChart = (transportCtx, points) => {
  const types = points.map((point) => point.type)
    .filter(getUniqItems);

  return new Chart(transportCtx, {
    type: `horizontalBar`,
    data: {
      datasets: [{
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        data: types.map((type) => getData(points, type)),
      }]
    },
    options: {
      scales: {
        yAxes: [{
          gridLines: {
            offsetGridLines: true
          }
        }]
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (`<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>
          <h1>This is a statistics!</h1>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`);
};

export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();
    this._points = points;

    this._moneyChart = null;
    this._transportChart = null;
    this._durationChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const transportCtx = element.querySelector(`.statistics__chart.statistics__chart--transport`);

    this._resetCharts();

    this._transportChart = renderTransportChart(transportCtx, this._points.getPointsAll());
  }

  _resetCharts() {
    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }
  }
}
