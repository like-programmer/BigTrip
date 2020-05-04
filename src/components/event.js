import {EVENT_TYPES} from "../const.js";
import {createTripTypeTitle} from "../utils.js";

const createOffersMarkup = (offers) => {
  return offers.map((offer) => {
    const title = offer.title;
    const price = offer.price;

    return (`
  <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>
`);
  }).join(`\n`);
};

export const createEventTemplate = (event) => {
  const {icon, eventName, destination, duration, price, offers} = event;

  const startDate = `2019-03-18`;
  const startTime = `10:30`;
  const endDate = `2019-03-18`;
  const endTime = `11:00`;

  const eventTitle = createTripTypeTitle(EVENT_TYPES, eventName);
  const offersMarkup = createOffersMarkup(offers);

  return (`
    <li class="trip-events__item">
        <div class="event">
            <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="${icon}"
                                         alt="Event type icon">
            </div>
            <h3 class="event__title">${eventTitle} ${destination}</h3>

            <div class="event__schedule">
                <p class="event__time">
                    <time class="event__start-time" datetime="${startDate}T${startTime}">${startTime}</time>
                                        &mdash;
                    <time class="event__end-time" datetime="${endDate}T${endTime}">${endTime}</time>
                </p>
                <p class="event__duration">${duration}</p>
            </div>

            <p class="event__price">
                &euro;&nbsp;
                <span class="event__price-value">${price}</span>
            </p>

            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
                ${offersMarkup}
            </ul>

            <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
            </button>
        </div>
    </li>
    `);
};
