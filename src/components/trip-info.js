import AbstractComponent from "./abstract-component.js";
import {MONTH_NAMES} from "../const.js";
import {getOrderedEvents} from "../utils/common.js";

const createTripName = (events) => {
  if (events.length <= 3) {
    return events.map((event) => {
      return (`${event.destination.name}`);
    }).join(` &mdash; `);
  } else {
    const eventsLastPoint = events.length - 1;
    return `${events[0].destination.name} &mdash; ... &mdash; ${events[eventsLastPoint].destination.name}`;
  }
};

const createTripLimits = (events, monthNames) => {
  const eventsLastPoint = events.length - 1;
  const startMonthName = monthNames[events[0].dateFrom.getMonth()];
  const endMonthName = monthNames[events[eventsLastPoint].dateTo.getMonth()];

  return (`${events[0].dateFrom.getDate()} ${startMonthName} &mdash; ${events[eventsLastPoint].dateTo.getDate()} ${endMonthName}`);
};

const calculateTotalPrice = (events) => {
  let totalPrice = 0;
  const priceSums = events.map((event) => {
    let priceSum = event.basePrice;
    event.offers.map((offer) => {
      priceSum = priceSum + offer.price;
    });
    return priceSum;
  });

  for (const price of priceSums) {
    totalPrice += price;
  }

  return totalPrice;
};

const createTripInfoTemplate = (events) => {
  const orderedEvents = getOrderedEvents(events);
  const isNoPoints = orderedEvents.length === 0;

  const tripName = isNoPoints ? null : createTripName(orderedEvents);
  const tripLimits = isNoPoints ? null : createTripLimits(orderedEvents, MONTH_NAMES);
  const totalPrice = calculateTotalPrice(orderedEvents);

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
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
