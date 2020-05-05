import {MONTH_NAMES} from "../const.js";

const createTripName = (events) => {
  if (events.length <= 3) {
    return events.map((event) => {
      return (`${event.destination}`);
    }).join(` &mdash; `);
  } else {
    const eventsLastPoint = events.length - 1;
    return `${events[0].destination} &mdash; ... &mdash; ${events[eventsLastPoint].destination}`;
  }
};

const createTripLimits = (events, monthNames) => {
  const eventsLastPoint = events.length - 1;
  const startMonthName = monthNames[events[0].startDate.getMonth()];
  const endMonthName = monthNames[events[eventsLastPoint].endDate.getMonth()];

  return (`${events[0].startDate.getDate()} ${startMonthName} &mdash; ${events[eventsLastPoint].endDate.getDate()} ${endMonthName}`);
};

export const createTripInfoTemplate = (events) => {
  const tripName = createTripName(events);
  const tripLimits = createTripLimits(events, MONTH_NAMES);

  const priceSums = events.map((event) => {
    let priceSum = event.price;
    event.offers.map((offer) => {
      offer.isChecked ? (priceSum = priceSum + offer.price) : priceSum;
    });
    return priceSum;
  });

  let totalPrice = 0;

  for (const mama of priceSums) {
    totalPrice += mama;
  }

  return (`
    <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${tripName}</h1>

              <p class="trip-info__dates">${tripLimits}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>
`);
};
