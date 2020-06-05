import AbstractComponent from "./abstract-component.js";
import {MONTH_NAMES} from "../const.js";
import {getOrderedPoints} from "../utils/common.js";

const createTripName = (points) => {
  if (points.length <= 3) {
    return points.map((point) => {
      return (`${point.destination.name}`);
    }).join(` &mdash; `);
  } else {
    const eventsLastPoint = points.length - 1;
    return `${points[0].destination.name} &mdash; ... &mdash; ${points[eventsLastPoint].destination.name}`;
  }
};

const createTripLimits = (points, monthNames) => {
  const pointsLastPoint = points.length - 1;
  const startMonthName = monthNames[points[0].dateFrom.getMonth()];
  const endMonthName = monthNames[points[pointsLastPoint].dateTo.getMonth()];

  return (`${points[0].dateFrom.getDate()} ${startMonthName} &mdash; ${points[pointsLastPoint].dateTo.getDate()} ${endMonthName}`);
};

const calculateTotalPrice = (points) => {
  let totalPrice = 0;
  const priceSums = points.map((point) => {
    let priceSum = point.basePrice;
    point.offers.map((offer) => {
      priceSum = priceSum + offer.price;
    });
    return priceSum;
  });

  for (const price of priceSums) {
    totalPrice = totalPrice + price;
  }

  return totalPrice;
};

const createTripInfoTemplate = (points) => {
  const orderedPoints = getOrderedPoints(points);
  const isNoPoints = orderedPoints.length === 0;

  const tripName = isNoPoints ? null : createTripName(orderedPoints);
  const tripLimits = isNoPoints ? null : createTripLimits(orderedPoints, MONTH_NAMES);
  const totalPrice = calculateTotalPrice(orderedPoints);

  return (`<section class="trip-main__trip-info  trip-info">
            ${isNoPoints ? `` : `
            <div class="trip-info__main">
              <h1 class="trip-info__title">${tripName}</h1>

              <p class="trip-info__dates">${tripLimits}</p>
            </div>
            `}

            <p class="trip-info__cost">
                Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>`);
};

export default class TripInfo extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
