import {EVENT_TYPES} from "../const.js";
import {createTripTypeTitle} from "../utils.js";

export const createEventTemplate = (event) => {
  const {icon, eventName, destination, duration, price} = event;

  const startDate = `2019-03-18`;
  const startTime = `10:30`;
  const endDate = `2019-03-18`;
  const endTime = `11:00`;

  const eventTitle = createTripTypeTitle(EVENT_TYPES, eventName);

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
                <li class="event__offer">
                    <span class="event__offer-title">Order Uber</span>
                    &plus;
                    &euro;&nbsp;<span class="event__offer-price">20</span>
                </li>
            </ul>

            <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
            </button>
        </div>
    </li>
    `);
};
