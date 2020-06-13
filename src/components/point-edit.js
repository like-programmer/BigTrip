import AbstractSmartComponent from "./abstract-smart-component.js";
import {POINT_TYPES, DESTINATION_ITEMS, OFFER_LIST} from "../const";
import {createTripTypeTitle, getCapitalizedType} from "../utils/common.js";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";

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

const createOffersMarkup = (offerType) => {
  const type = offerType.type;
  return offerType.offers.map((offer, index) => {
    const title = offer.title;
    const price = offer.price;
    const isChecked = offer.isChecked;

    return (`
  <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index}"
             type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${type}-${index}">
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

const createEditPointTemplate = (point, options = {}) => {
  const {basePrice, dateFrom, dateTo, isFavourite, offers, isAdding} = point;
  const {pointType, destinationCity = {name: ``, description: ``, pictures: []}} = options;

  const [pointIcon] = POINT_TYPES.filter((it) => it.name === pointType).map((it) => it.icon);

  const destinationName = destinationCity.name;
  const pointTitle = createTripTypeTitle(POINT_TYPES, pointType);

  const destinationListMarkup = createDestinationListMarkup(DESTINATION_ITEMS);

  const startDate = moment(dateFrom).format(`DD/MM/YYYY HH:mm`);
  const endDate = moment(dateTo).format(`DD/MM/YYYY HH:mm`);

  const destinationDescription = destinationCity.description;
  const photoTapeMarkup = createPhotoTapeMarkup(destinationCity.pictures);

  const offerList = OFFER_LIST.slice();
  const [filteredOfferType] = offerList.filter((it) => it.type === pointType);

  if (!isAdding) {
    offers.map((it, i) => {
      filteredOfferType.offers[i].isChecked = it.title === filteredOfferType.offers[i].title;
    });
  }

  const isOffersAvailable = filteredOfferType.offers.length !== 0;
  const offersMarkup = createOffersMarkup(filteredOfferType);

  const transferTypeListMarkup = createTypesListMarkup(POINT_TYPES.filter((it) => it.type === `transfer`), pointType);

  const activityTypeListMarkup = createTypesListMarkup(POINT_TYPES.filter((it) => it.type === `activity`), pointType);

  return (`${isAdding ? `` : `<li class="trip-events__item">
      `}<form class="event  event--edit ${isAdding ? `trip-events__item` : ``}" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${pointIcon}" alt="Event type icon">
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
              ${pointTitle}
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isAdding ? `disabled` : ``}>Save</button>
          <button class="event__reset-btn" type="reset">${isAdding ? `Cancel` : `Delete`}</button>

          ${isAdding ? `` : `
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
          `}

         ${isAdding ? `` : `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
         `}
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

        ${destinationName !== `` ? `
          <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destinationDescription}</p>

              <div class="event__photos-container">
                  <div class="event__photos-tape">
                      ${photoTapeMarkup}
                  </div>
              </div>
          </section>
          ` : ``}
        </section>
    </form>
    ${isAdding ? `` : `</li>`}`);
};

const parseFormData = (formData) => {
  const eventType = formData.get(`event-type`);
  const startDate = moment(formData.get(`event-start-time`), `DD/MM/YYYY HH:mm`).toISOString();
  const endDate = moment(formData.get(`event-end-time`), `DD/MM/YYYY HH:mm`).toISOString();
  const isFavourite = formData.get(`event-favorite`);
  const [offerType] = OFFER_LIST.filter((it) => it.type === eventType);
  const [destinationItem] = DESTINATION_ITEMS.filter((item) => item.name === formData.get(`event-destination`));

  return {
    basePrice: parseInt(formData.get(`event-price`), 10),
    dateFrom: startDate,
    dateTo: endDate,
    destination: {
      description: destinationItem.description,
      name: destinationItem.name,
      pictures: destinationItem.pictures,
    },
    isFavourite: !!isFavourite,
    offers: offerType.offers.filter((it) => it.isChecked),
    type: eventType,
  };
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point) {
    super();
    this._point = point;
    this._flatpickrFrom = null;
    this._flatpickrTo = null;
    this._submitHandler = null;
    this._closeBtnClickHandler = null;
    this._favouriteBtnClickHandler = null;
    this._deleteBtnClickHandler = null;
    this._pointType = point.type;
    this._destinationCity = point.destination;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditPointTemplate(this._point, {
      pointType: this._pointType,
      destinationCity: this._destinationCity
    });
  }

  removeElement() {
    if (this._flatpickrFrom && this._flatpickrTo) {
      this._flatpickrFrom.destroy();
      this._flatpickrFrom = null;

      this._flatpickrTo.destroy();
      this._flatpickrTo = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    if (!this._point.isAdding) {
      this.setCloseBtnClickHandler(this._closeBtnClickHandler);
      this.setFavouriteBtnClickHandler(this._favouriteBtnClickHandler);
    }
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteBtnClickHandler(this._deleteBtnClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;

    this._pointType = point.type;
    this._destinationCity = point.destination;

    this.rerender();
  }

  getData() {
    let form;

    if (!this._point.isAdding) {
      form = this.getElement().querySelector(`form`);
    } else {
      form = this.getElement();
    }

    const formData = new FormData(form);
    return parseFormData(formData);
  }

  setFavouriteBtnClickHandler(handler) {
    this.getElement().querySelector(`#event-favorite-1`).addEventListener(`click`, handler);
    this._favouriteBtnClickHandler = handler;
  }

  setCloseBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    this._closeBtnClickHandler = handler;
  }

  setSubmitHandler(handler) {
    if (!this._point.isAdding) {
      this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    } else {
      this.getElement().addEventListener(`submit`, handler);
      document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
    }
    this._submitHandler = handler;
  }

  setDeleteBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._deleteBtnClickHandler = handler;

    if (this._point.isAdding) {
      document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
    }
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
      dateFormat: `d/m/Y H:i`,
      allowInput: true,
      enableTime: true,
      time_24hr: true,
      defaultDate: this._point.dateFrom || `today`,
      maxDate: this._point.dateTo,
    });

    const dateToInputElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrTo = flatpickr(dateToInputElement, {
      dateFormat: `d/m/Y H:i`,
      allowInput: true,
      enableTime: true,
      time_24hr: true,
      defaultDate: this._point.dateTo || this._point.dateFrom,
      minDate: this._point.dateFrom,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._pointType = evt.target.value;
      this.rerender();
    });

    // const dateFromInputElement = this.getElement().querySelector(`#event-start-time-1`);
    // const dateToInputElement = this.getElement().querySelector(`#event-end-time-1`);
    // dateToInputElement.addEventListener(`change`, () => {
    //   this.rerender();
    // });

    const destinationElement = element.querySelector(`#event-destination-1`);
    const saveBtn = this.getElement().querySelector(`.event__save-btn`);

    destinationElement.addEventListener(`change`, (evt) => {
      [this._destinationCity] = DESTINATION_ITEMS.filter((item) => item.name === evt.target.value);

      saveBtn.disabled = evt.target.value.length < 1;

      this.rerender();
    });

    element.querySelector(`#event-price-1`).addEventListener(`input`, (evt) => {
      saveBtn.disabled = evt.target.value.length < 1;
    });
  }
}
