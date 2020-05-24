import SortComponent, {SortType} from "../components/sort.js";
import DaysListComponent from "../components/days-list.js";
import DayListItemComponent from "../components/day-list-item.js";
import NoPointsComponent from "../components/no-points.js";

import PointController from "./point.js";

import {RenderPosition, render} from "../utils/render.js";
import {getOrderedEvents} from "../utils/common.js";
// import PointComponent from "../components/point.js";
// import PointEditComponent from "../components/point-edit.js";
// import {RenderPosition, render, replace} from "../utils/render.js";

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

const renderPoints = (container, events, sortType) => {
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

      return groupedEventByDate.map((event) => {
        const pointController = new PointController(eventListElement);
        pointController.render(event);
        return pointController;
      });
    });
  } else {
    const dayListItemComponent = new DayListItemComponent();
    render(container, dayListItemComponent, RenderPosition.BEFOREEND);

    const sortedEvents = getSortedEvents(events, sortType);

    const eventListElement = dayListItemComponent.getElement().querySelector(`.trip-events__list`);

    return sortedEvents.map((event) => {
      const pointController = new PointController(eventListElement);
      pointController.render(event);
      return pointController;
    });
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events;

    if (this._events.length === 0) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._daysListComponent, RenderPosition.BEFOREEND);

    const dayListElement = this._daysListComponent.getElement();

    renderPoints(dayListElement, this._events, this._sortComponent.getSortType());
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._events, sortType);
    const dayListElement = this._daysListComponent.getElement();
    dayListElement.innerHTML = ``;
    renderPoints(dayListElement, sortedEvents, sortType);
  }
}
