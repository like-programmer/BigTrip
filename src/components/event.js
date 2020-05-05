import {EVENT_TYPES} from "../const.js";
import {createTripTypeTitle, formatTime, formatDateYMD, getDuration} from "../utils.js";

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
  const {eventType, destination, startDate, endDate, price, offers} = event;

  const eventTitle = createTripTypeTitle(EVENT_TYPES, eventType.name);
  const eventIcon = eventType.icon;

  const formattedStartDate = formatDateYMD(startDate);
  const formattedStartTime = formatTime(startDate);

  const formattedEndDate = formatDateYMD(endDate);
  const formattedEndTime = formatTime(endDate);

  const duration = getDuration(startDate, endDate);

  const offersMarkup = createOffersMarkup(offers);

  return (`
    <li class="trip-events__item">
        <div class="event">
            <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="${eventIcon}"
                                         alt="Event type icon">
            </div>
            <h3 class="event__title">${eventTitle} ${destination}</h3>

            <div class="event__schedule">
                <p class="event__time">
                    <time class="event__start-time" datetime="${formattedStartDate}T${formattedStartTime}">${formattedStartTime}</time>
                                        &mdash;
                    <time class="event__end-time" datetime="${formattedEndDate}T${formattedEndTime}">${formattedEndTime}</time>
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
