import AbstractSmartComponent from "./abstract-smart-component.js";
import {EVENT_TYPES, DESTINATION_ITEMS, OFFER_LIST} from "../const";
import {createTripTypeTitle, getCapitalizedType} from "../utils/common.js";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const createTypesListMarkup = (types, checkedType) => {
  return types.map((type) => {
    const capitalizedName = getCapitalizedType(type.name);

    return (`
    <div class="event__type-item">
      <input id="event-type-${type.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}" ${type.name === checkedType ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}-1">${capitalizedName}</label>
    </div>
  `);
  }).join(`\n`);
};

const createDestinationListMarkup = (cities) => {
  return cities.map((city) => {
    return (`
  <option value="${city.name}"></option>
  `);
  }).join(`\n`);
};

const createOffersMarkup = (offers) => {
  return offers.map((offer) => {
    const type = ``;
    const title = offer.title;
    const price = offer.price;
    const isChecked = offer.isChecked;

    return (`
  <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1"
             type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${type}-1">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
  </div>
  `);
  }).join(`\n`);
};

const createPhotoTapeMarkup = (photos) => {
  return photos.map((photo) => {
    return (`
   <img class="event__photo" src="${photo.src}" alt="${photo.description}">
   `);
  }).join(`\n`);
};

const createEditEventTemplate = (event, options = {}) => {
  const {basePrice, dateFrom, dateTo, isFavourite, offers} = event;
  const {eventType, destinationCity} = options;

  const [eventIcon] = EVENT_TYPES.filter((it) => it.name === eventType).map((it) => it.icon);

  const destinationName = destinationCity.name;
  const eventTitle = createTripTypeTitle(EVENT_TYPES, eventType);

  const destinationListMarkup = createDestinationListMarkup(DESTINATION_ITEMS);

  const getFormattedDateTime = (date) => {
    const stringedDate = date.toISOString();
    return (`${stringedDate.split(`-`)[2].split(`T`)[0]}/${stringedDate.split(`-`)[1]}/${stringedDate.split(`-`)[0].slice(2)} ${stringedDate.split(`-`)[2].split(`T`)[1].slice(0, 5)}`);
  };

  const formattedDateFrom = getFormattedDateTime(dateFrom);
  const formattedDateTo = getFormattedDateTime(dateTo);

  const destinationDescription = destinationCity.description;
  const photoTapeMarkup = createPhotoTapeMarkup(destinationCity.pictures);


  const [filteredOfferType] = OFFER_LIST.filter((it) => it.type === eventType);
  const filteredOfferList = filteredOfferType.offers;
  offers.map((it, i) => {
    filteredOfferList[i].isChecked = it.title === filteredOfferList[i].title;
  });

  const isOffersAvailable = filteredOfferList.length !== 0;
  const offersMarkup = createOffersMarkup(filteredOfferList);

  const transferTypeListMarkup = createTypesListMarkup(EVENT_TYPES.filter((it) => it.type === `transfer`), eventType);

  const activityTypeListMarkup = createTypesListMarkup(EVENT_TYPES.filter((it) => it.type === `activity`), eventType);

  return (`<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${eventIcon}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                
                ${transferTypeListMarkup}
                
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                ${activityTypeListMarkup}
                
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${eventTitle}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationListMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedDateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedDateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
        ${isOffersAvailable ? `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
            ${offersMarkup}
            </div>
          </section>
        ` : ``}

          <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destinationDescription}</p>

              <div class="event__photos-container">
                  <div class="event__photos-tape">
                      ${photoTapeMarkup}
                  </div>
              </div>
          </section>
        </section>
    </form>
    </li>`);
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;
    this._flatpickrFrom = null;
    this._flatpickrTo = null;
    this._submitHandler = null;
    this._closeBtnClickHandler = null;
    this._favouriteBtnClickHandler = null;
    this._eventType = event.type;
    this._destinationCity = event.destination;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event, {
      eventType: this._eventType,
      destinationCity: this._destinationCity
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseBtnClickHandler(this._closeBtnClickHandler);
    this.setFavouriteBtnClickHandler(this._favouriteBtnClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;

    this._eventType = event.type;
    this._destinationCity = event.destination;

    this.rerender();
  }

  setFavouriteBtnClickHandler(handler) {
    this.getElement().querySelector(`#event-favorite-1`).addEventListener(`click`, handler);
    this._favouriteBtnClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setCloseBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    this._closeBtnClickHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickrFrom && this._flatpickrTo) {
      this._flatpickrFrom.destroy();
      this._flatpickrFrom = null;
      this._flatpickrTo.destroy();
      this._flatpickrTo = null;
    }

    const dateFromInputElement = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpickrFrom = flatpickr(dateFromInputElement, {
      dateFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._event.dateFrom || `today`
    });

    const dateToInputElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrTo = flatpickr(dateToInputElement, {
      dateFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._event.dateTo || this._event.dateFrom,
      minDate: this._event.dateFrom,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._eventType = evt.target.value;
      this.rerender();
    });

    element.querySelector(`#event-destination-1`).addEventListener(`change`, (evt) => {
      [this._destinationCity] = DESTINATION_ITEMS.filter((item) => item.name === evt.target.value);
      this.rerender();
    });
  }
}
