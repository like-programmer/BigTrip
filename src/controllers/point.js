import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import PointModel from "../models/point.js";
import {POINT_TYPES, Mode, RenderPosition} from "../const";
import {render, replace, remove} from "../utils/render.js";
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
  const isFavourite = formData.get(`event-favorite`);

  const offerLabelElements = document.querySelectorAll(`.event__offer-label`);
  let offers = [];
  offerLabelElements.forEach((element) => {
    if (element.control.checked) {
      offers.push({
        price: parseInt(element.lastElementChild.textContent, 10),
        title: element.firstElementChild.textContent,
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
    "is_favourite": !!isFavourite,
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

    if (!point.isAdding) {
      this._pointEditComponent.setFavouriteBtnClickHandler(() => {
        const newPoint = PointModel.clone(point);
        newPoint.isFavourite = !newPoint.isFavourite;
        this._dataChangeHandler(this, point, newPoint);
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
      this._dataChangeHandler(this, point, data);
    });

    this._pointEditComponent.setDeleteBtnClickHandler(() => this._dataChangeHandler(this, point, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
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
