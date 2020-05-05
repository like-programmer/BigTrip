const createtripName = (events) => {
  if (events.length <= 3) {
    return events.map((event) => {
      return (`${event.destination}`);
    }).join(` &mdash; `);
  } else {
    const eventsLastPoint = events.length - 1;
    return `${events[0].destination} &mdash; ... &mdash; ${events[eventsLastPoint].destination}`;
  }
};

const createtripLimits = (events) => {
  return (`Mar 18&nbsp;&mdash;&nbsp;20`);
};

export const createTripInfoTemplate = (events) => {
  const tripName = createtripName(events);
  const tripLimits = createtripLimits(events);
  const totalPrice = 1000;

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
