import SortComponent, {SortType} from "../components/sort.js";
import DaysListComponent from "../components/days-list.js";
import DayListItemComponent from "../components/day-list-item.js";
import NoPointsComponent from "../components/no-points.js";

import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point.js";

import {RenderPosition, render, remove} from "../utils/render.js";
import {getOrderedPoints} from "../utils/common.js";

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  const pointsCopy = points.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedPoints = pointsCopy.sort((a, b) => a.dateFrom - b.dateFrom);
      break;

    case SortType.TIME:
      pointsCopy.forEach((it) => {
        it.duration = it.dateTo - it.dateFrom;
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

const renderPoints = (container, points, sortType, dataChangeHandler, viewChangeHandler) => {
  let pointControllers = [];
  let dayComponents = [];

  if (sortType === SortType.EVENT) {
    const orderedByDateFromPoints = getOrderedPoints(points);

    const getuniqueArray = (array) => {
      return Array.from(new Set(array));
    };

    const pointDatesFromAsString = orderedByDateFromPoints.map((it) => {
      return it.dateFrom.toISOString().split(`T`)[0];
    });

    const uniquePointDatesFrom = getuniqueArray(pointDatesFromAsString);

    uniquePointDatesFrom.forEach((date, i) => {
      const dayListItemComponent = new DayListItemComponent(date, i);
      dayComponents.push(dayListItemComponent);
      render(container, dayListItemComponent, RenderPosition.BEFOREEND);

      const groupedPointByDate = orderedByDateFromPoints.filter((point) => {
        return date === point.dateFrom.toISOString().split(`T`)[0];
      });

      const pointListElement = dayListItemComponent.getElement().querySelector(`.trip-events__list`);

      groupedPointByDate.map((event) => {
        const pointController = new PointController(pointListElement, dataChangeHandler, viewChangeHandler);
        pointController.render(event);
        pointControllers.push(pointController);
      });
    });
  } else {
    const dayListItemComponent = new DayListItemComponent();
    dayComponents.push(dayListItemComponent);
    render(container, dayListItemComponent, RenderPosition.BEFOREEND);

    const sortedPoints = getSortedPoints(points, sortType);

    const pointListElement = dayListItemComponent.getElement().querySelector(`.trip-events__list`);

    sortedPoints.map((event) => {
      const pointController = new PointController(pointListElement, dataChangeHandler, viewChangeHandler);
      pointController.render(event);
      pointControllers.push(pointController);
    });
  }

  return [pointControllers, dayComponents];
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._pointControllers = [];
    this._dayComponents = [];
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
    this._noPointsComponent = new NoPointsComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    this._pointsModel.setFilterChangeHandler(this._filterChangeHandler);
  }

  render() {
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._daysListComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points);
  }

  _removePoints() {
    this._pointControllers.forEach((controller) => controller.destroy());
    this._pointControllers = [];
    this._dayComponents.forEach((day) => remove(day));
  }

  _renderPoints(points) {
    const dayListElement = this._daysListComponent.getElement();

    const newPoints = renderPoints(dayListElement, points, this._sortComponent.getSortType(), this._dataChangeHandler, this._viewChangeHandler);

    this._pointControllers = this._pointControllers.concat(newPoints[0]);
    this._dayComponents = this._dayComponents.concat(newPoints[1]);
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
  }

  _dataChangeHandler(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  _viewChangeHandler() {
    this._pointControllers.forEach((controller) => controller.setDefaultView());
  }

  _sortTypeChangeHandler(sortType) {
    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), sortType);
    this._removePoints();
    this._renderPoints(sortedPoints);
  }

  _filterChangeHandler() {
    this._updatePoints();
  }
}
