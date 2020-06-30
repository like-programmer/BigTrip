import SortComponent from "../components/sort.js";
import DaysListComponent from "../components/days-list.js";
import DayListItemComponent from "../components/day-list-item.js";
import NoPointsComponent from "../components/no-points.js";
import PointController, {EmptyPoint} from "./point.js";
import {Mode as PointControllerMode, SortType, RenderPosition, HIDDEN_CLASS} from "../const.js";
import {render, remove} from "../utils/render.js";
import {getOrderedPoints} from "../utils/common.js";
import moment from "moment";

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  const pointsCopy = points.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedPoints = pointsCopy.sort((a, b) => {
        const dateA = new Date(a.dateFrom);
        const dateB = new Date(b.dateFrom);

        return dateA - dateB;
      });
      break;

    case SortType.TIME:
      pointsCopy.forEach((it) => {
        const dateA = new Date(it.dateFrom);
        const dateB = new Date(it.dateTo);
        it.duration = dateB - dateA;
      });

      sortedPoints = pointsCopy.sort((a, b) => b.duration - a.duration);
      break;

    case SortType.PRICE:
      pointsCopy.forEach((point) => {
        let totalPrice = 0;
        totalPrice = totalPrice + point.basePrice;
        point.offers.forEach((offer) => {
          totalPrice = totalPrice + offer.price;
          return totalPrice;
        });
        point.totalPrice = totalPrice;
      });
      sortedPoints = pointsCopy.sort((a, b) => b.totalPrice - a.totalPrice);
      break;
  }

  return sortedPoints;
};

const renderPoints = (container, points, sortType, dataChangeHandler, viewChangeHandler, offers, destinations) => {
  let pointControllers = [];
  let dayComponents = [];

  if (sortType === SortType.EVENT) {
    const orderedByDateFromPoints = getOrderedPoints(points);

    const getuniqueArray = (array) => {
      return Array.from(new Set(array));
    };

    const pointDatesFromAsString = orderedByDateFromPoints.map((it) => {
      return moment(it.dateFrom).format(`YYYY-MM-DD`);
    });

    const uniquePointDatesFrom = getuniqueArray(pointDatesFromAsString);

    uniquePointDatesFrom.forEach((date, i) => {
      const dayListItemComponent = new DayListItemComponent(date, i);
      dayComponents.push(dayListItemComponent);
      render(container, dayListItemComponent, RenderPosition.BEFOREEND);

      const groupedPointByDate = orderedByDateFromPoints.filter((point) => {
        return date === moment(point.dateFrom).format(`YYYY-MM-DD`);
      });

      const pointListElement = dayListItemComponent.getElement().querySelector(`.trip-events__list`);

      groupedPointByDate.map((point) => {
        const pointController = new PointController(pointListElement, dataChangeHandler, viewChangeHandler, offers, destinations);
        pointController.render(point, PointControllerMode.DEFAULT);
        pointControllers.push(pointController);
      });
    });
  } else {
    const dayListItemComponent = new DayListItemComponent();
    dayComponents.push(dayListItemComponent);
    render(container, dayListItemComponent, RenderPosition.BEFOREEND);

    const sortedPoints = getSortedPoints(points, sortType);

    const pointListElement = dayListItemComponent.getElement().querySelector(`.trip-events__list`);

    sortedPoints.map((point) => {
      const pointController = new PointController(pointListElement, dataChangeHandler, viewChangeHandler, offers, destinations);
      pointController.render(point, PointControllerMode.DEFAULT);
      pointControllers.push(pointController);
    });
  }

  return [pointControllers, dayComponents];
};

export default class TripController {
  constructor(container, pointsModel, offersModel, destinationsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._api = api;
    this._pointControllers = [];
    this._dayComponents = [];
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
    this._noPointsComponent = new NoPointsComponent();

    this._creatingPoint = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    this._pointsModel.setFilterChangeHandler(this._filterChangeHandler);
  }

  show() {
    if (this._container) {
      this._container.classList.remove(HIDDEN_CLASS);
    }
  }

  hide() {
    if (this._container) {
      this._container.classList.add(HIDDEN_CLASS);
    }
  }

  render() {
    const points = this._pointsModel.getPoints();
    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();

    if (points.length === 0) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._daysListComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points, offers, destinations);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._updatePoints();
    this._creatingPoint = new PointController(this._container, this._dataChangeHandler, this._viewChangeHandler, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
    this._container.removeChild(this._sortComponent.getElement());
    this._container.prepend(this._sortComponent.getElement());
  }

  _removePoints() {
    this._pointControllers.forEach((controller) => controller.destroy());
    this._pointControllers = [];
    this._dayComponents.forEach((day) => remove(day));
  }

  _renderPoints(points, offers, destinations) {
    const dayListElement = this._daysListComponent.getElement();

    const newPoints = renderPoints(dayListElement, points, this._sortComponent.getSortType(), this._dataChangeHandler, this._viewChangeHandler, offers, destinations);

    this._pointControllers = this._pointControllers.concat(newPoints[0]);
    this._dayComponents = this._dayComponents.concat(newPoints[1]);
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints(), this._offersModel.getOffers(), this._destinationsModel.getDestinations());
  }

  _dataChangeHandler(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
      } else {
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            pointController.destroy();
            this._updatePoints();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        });
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

          if (isSuccess) {
            pointController.render(pointModel, PointControllerMode.DEFAULT);
            this._updatePoints();
          }
        });
    }
  }

  _viewChangeHandler() {
    this._pointControllers.forEach((controller) => controller.setDefaultView());
  }

  _sortTypeChangeHandler(sortType) {
    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), sortType);
    this._removePoints();
    this._renderPoints(sortedPoints, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
  }

  _filterChangeHandler() {
    this._updatePoints();
  }
}
