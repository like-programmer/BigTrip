const createtripName = () => {
  return (`Amsterdam &mdash; Chamonix &mdash; Geneva`);
};

const createtripLimits = () => {
  return (`Mar 18&nbsp;&mdash;&nbsp;20`);
};

export const createTripInfoTemplate = () => {
  const tripName = createtripName();
  const tripLimits = createtripLimits();
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
