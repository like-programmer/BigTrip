import {POINT_TYPES} from "../const.js";
import {getDuration, createTripTypeTitle} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

import moment from "moment";

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

const createPointTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;

  const destinationName = destination.name;
  const pointTitle = createTripTypeTitle(POINT_TYPES, type);

  const startDate = moment(dateFrom).format(`YYYY-MM-DDTHH:mm`);
  const startTime = moment(dateFrom).format(`HH:mm`);

  const endDate = moment(dateTo).format(`YYYY-MM-DDTHH:mm`);
  const endTime = moment(dateTo).format(`HH:mm`);

  const duration = getDuration(dateFrom, dateTo);

  const [pointIcon] = POINT_TYPES.filter((it) => it.name === type).map((it) => it.icon);
  const offersMarkup = createOffersMarkup(offers);

  return (`<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="${pointIcon}" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointTitle} ${destinationName}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDate}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDate}">${endTime}</time>
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

export default class Point extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createPointTemplate(this._event);
  }

  setEditBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
