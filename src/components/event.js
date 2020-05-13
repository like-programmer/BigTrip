import {EVENT_TYPES} from "../const.js";
import {getDuration, createTripTypeTitle, createElement} from "../utils.js";

const createOffersMarkup = (offers) => {
  return offers.slice(0, 2).map((offer) => {
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

const createEventTemplate = (event) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = event;

  const destinationName = destination.name;
  const eventTitle = createTripTypeTitle(EVENT_TYPES, type);

  const formattedDateFrom = dateFrom.toISOString().slice(0, -5);
  const formattedTimeFrom = dateFrom.toISOString().split(`T`)[1].slice(0, 5);

  const formattedDateTo = dateTo.toISOString().slice(0, -5);
  const formattedTimeTo = dateTo.toISOString().split(`T`)[1].slice(0, 5);

  const duration = getDuration(dateFrom, dateTo);

  const [eventIcon] = EVENT_TYPES.filter((it) => it.name === type).map((it) => it.icon);
  const offersMarkup = createOffersMarkup(offers);

  return (`<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="${eventIcon}" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTitle} ${destinationName}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formattedDateFrom}">${formattedTimeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${formattedDateTo}">${formattedTimeTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
};

export default class Event {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
