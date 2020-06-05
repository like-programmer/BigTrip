import SortComponent, {SortType} from "../components/sort.js";
import DaysListComponent from "../components/days-list.js";
import DayListItemComponent from "../components/day-list-item.js";
import NoPointsComponent from "../components/no-points.js";

import PointController from "./point.js";

import {RenderPosition, render} from "../utils/render.js";
import {getOrderedEvents} from "../utils/common.js";

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const eventsCopy = events.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = eventsCopy.sort((a, b) => a.dateFrom - b.dateFrom);
      break;

    case SortType.TIME:
      eventsCopy.forEach((it) => {
        it.duration = it.dateTo - it.dateFrom;
      });

      sortedEvents = eventsCopy.sort((a, b) => b.duration - a.duration);
      break;

    case SortType.PRICE:
      eventsCopy.forEach((event) => {
        let totalPrice = 0;
        totalPrice = totalPrice + event.basePrice;
        event.offers.forEach((offer) => {
          totalPrice = totalPrice + offer.price;
          return totalPrice;
        });
        event.totalPrice = totalPrice;
      });
      sortedEvents = eventsCopy.sort((a, b) => b.totalPrice - a.totalPrice);
      break;
  }

  return sortedEvents;
};

const renderPoints = (container, events, sortType, dataChangeHandler, _viewChangeHandler) => {
  let pointControllers = [];

  if (sortType === SortType.EVENT) {
    const orderedByDateFromEvents = getOrderedEvents(events);

    const getuniqueArray = (array) => {
      return Array.from(new Set(array));
    };

    const eventDatesFromAsString = orderedByDateFromEvents.map((it) => {
      return it.dateFrom.toISOString().split(`T`)[0];
    });

    const uniqueEventDatesFrom = getuniqueArray(eventDatesFromAsString);

    uniqueEventDatesFrom.forEach((date, i) => {
      const dayListItemComponent = new DayListItemComponent(date, i);
      render(container, dayListItemComponent, RenderPosition.BEFOREEND);

      const groupedEventByDate = orderedByDateFromEvents.filter((event) => {
        return date === event.dateFrom.toISOString().split(`T`)[0];
      });

      const eventListElement = dayListItemComponent.getElement().querySelector(`.trip-events__list`);

      groupedEventByDate.map((event) => {
        const pointController = new PointController(eventListElement, dataChangeHandler, _viewChangeHandler);
        pointController.render(event);
        pointControllers.push(pointController);
      });
    });
  } else {
    const dayListItemComponent = new DayListItemComponent();
    render(container, dayListItemComponent, RenderPosition.BEFOREEND);

    const sortedEvents = getSortedEvents(events, sortType);

    const eventListElement = dayListItemComponent.getElement().querySelector(`.trip-events__list`);

    sortedEvents.map((event) => {
      const pointController = new PointController(eventListElement, dataChangeHandler, _viewChangeHandler);
      pointController.render(event);
      pointControllers.push(pointController);
    });
  }

  return pointControllers;
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._pointControllers = [];
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
    this._noPointsComponent = new NoPointsComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
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

  _renderPoints(points) {
    const dayListElement = this._daysListComponent.getElement();

    const newPoints = renderPoints(dayListElement, points, this._sortComponent.getSortType(), this._dataChangeHandler, this._viewChangeHandler);

    this._pointControllers = this._pointControllers.concat(newPoints);
  }

  _dataChangeHandler(pointController, oldData, newData) {
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData);
    }
  }

  _viewChangeHandler() {
    this._pointControllers.forEach((controller) => controller.setDefaultView());
  }

  _sortTypeChangeHandler(sortType) {
    const sortedEvents = getSortedEvents(this._pointsModel.getPoints(), sortType);
    const dayListElement = this._daysListComponent.getElement();
    dayListElement.innerHTML = ``;

    const newPoints = renderPoints(dayListElement, sortedEvents, sortType, this._dataChangeHandler, this._viewChangeHandler);
    this._pointControllers = this._pointControllers.concat(newPoints);
  }
}
