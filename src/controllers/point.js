import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import PointModel from "../models/point.js";
import {POINT_TYPES, Mode, RenderPosition, SHAKE_ANIMATION_TIMEOUT} from "../const";
import {render, replace, remove} from "../utils/render.js";
import {debounce} from "../utils/common.js";
import moment from "moment";

export const EmptyPoint = {
  basePrice: ``,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: {
    description: ``,
    name: ``,
    pictures: [],
  },
  offers: [],
  type: POINT_TYPES[0].name,
  isAdding: true,
};

const parseFormData = (formData, allOffers, allDestinations) => {
  const eventType = formData.get(`event-type`);
  const startDate = moment(formData.get(`event-start-time`), `DD/MM/YYYY HH:mm`).toISOString();
  const endDate = moment(formData.get(`event-end-time`), `DD/MM/YYYY HH:mm`).toISOString();
  const isFavorite = formData.get(`event-favorite`);

  const offerLabelElements = document.querySelectorAll(`.event__offer-label`);
  let offers = [];
  offerLabelElements.forEach((element) => {
    if (element.control.checked) {
      offers.push({
        title: element.firstElementChild.textContent,
        price: parseInt(element.lastElementChild.textContent, 10),
      });
    }
  });

  const [destinationItem] = allDestinations.filter((item) => item.name === formData.get(`event-destination`));

  return new PointModel({
    "base_price": parseInt(formData.get(`event-price`), 10),
    "date_from": startDate,
    "date_to": endDate,
    "destination": {
      "description": destinationItem.description,
      "name": destinationItem.name,
      "pictures": destinationItem.pictures,
    },
    "is_favorite": !!isFavorite,
    "offers": offers,
    "type": eventType,
  });
};

export default class PointController {
  constructor(container, dataChangeHandler, viewChangeHandler, offers, destinations) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._offers = offers;
    this._destinations = destinations;

    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;
    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, this._offers, this._destinations);


    this._pointComponent.setEditBtnClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    if (this._mode !== Mode.ADDING) {
      this._pointEditComponent.setFavoriteBtnClickHandler(() => {
        debounce(() => {
          const newPoint = PointModel.clone(point);
          newPoint.isFavorite = !newPoint.isFavorite;
          this._dataChangeHandler(this, point, newPoint);
        });
      });

      this._pointEditComponent.setCloseBtnClickHandler(() => {
        document.removeEventListener(`keydown`, this._escKeyDownHandler);
        this._replaceEditToPoint();
      });
    }

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData, this._offers, this._destinations);

      this._pointEditComponent.setData({
        saveBtnText: `Saving...`,
      });

      switch (this._mode) {
        case Mode.EDIT:
          this._pointEditComponent.getElement().querySelector(`form`).classList.add(`event--disabled`);
          break;
        case Mode.ADDING:
          this._pointEditComponent.getElement().classList.add(`event--disabled`);
          break;
      }

      document.querySelector(`.trip-main__event-add-btn`).disabled = true;

      this._dataChangeHandler(this, point, data);
    });

    this._pointEditComponent.setDeleteBtnClickHandler(() => {
      this._pointEditComponent.setData({
        deleteBtnText: `Deleting...`,
      });

      this._dataChangeHandler(this, point, null);
    });

    switch (this._mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.EDIT:
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replacePointToEdit();
        } else {
          render(this._container, this._pointEditComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointComponent && oldPointEditComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._escKeyDownHandler);

        render(this._container, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  shake() {
    this._pointEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._pointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._pointEditComponent.getElement().style.animation = ``;
      this._pointComponent.getElement().style.animation = ``;

      this._pointEditComponent.setData({
        saveBtnText: `Save`,
        deleteBtnText: `Delete`,
      });

      switch (this._mode) {
        case Mode.EDIT:
          this._pointEditComponent.getElement().querySelector(`form`).classList.remove(`event--disabled`);
          break;
        case Mode.ADDING:
          this._pointEditComponent.getElement().classList.remove(`event--disabled`);
          this._pointEditComponent.getElement().querySelector(`.event__save-btn`).disabled = false;
          document.querySelector(`.trip-main__event-add-btn`).disabled = true;
          break;
      }
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceEditToPoint() {
    this._pointEditComponent.reset();
    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._viewChangeHandler();
    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _escKeyDownHandler(evt) {
    const isEsc = evt.key === `Escape` || evt.key === `Esc`;
    if (isEsc) {
      if (this._mode === Mode.ADDING) {
        this._dataChangeHandler(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
