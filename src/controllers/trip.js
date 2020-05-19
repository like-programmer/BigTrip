import SortComponent, {SortType} from "../components/sort";
import DaysListComponent from "../components/days-list";
import DayListItemComponent from "../components/day-list-item";
import EventComponent from "../components/event.js";
import EditEventComponent from "../components/edit-event.js";
import NoEventsComponent from "../components/no-events";

import {RenderPosition, render, replace} from "../utils/render.js";
import {getOrderedEvents} from "../utils/common";


const renderEvent = (dayElement, event) => {
  const replaceEventToEdit = () => {
    replace(editEventComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, editEventComponent);
  };

  const documentEscKeydownHandler = (evt) => {
    const isEsc = evt.key === `Escape` || evt.key === `Esc`;
    if (isEsc) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, documentEscKeydownHandler);
    }
  };

  const eventComponent = new EventComponent(event);
  eventComponent.setEditBtnClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, documentEscKeydownHandler);
  });

  const editEventComponent = new EditEventComponent(event);
  editEventComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, documentEscKeydownHandler);
  });
  editEventComponent.setCloseHandler(() => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, documentEscKeydownHandler);
  });

  render(dayElement, eventComponent, RenderPosition.BEFOREEND);
};

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

const renderEvents = (container, events, sortType) => {
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
      groupedEventByDate.forEach((event) => {
        renderEvent(eventListElement, event);
      });
    });
  } else {
    const dayListItemComponent = new DayListItemComponent();
    render(container, dayListItemComponent, RenderPosition.BEFOREEND);

    const sortedEvents = getSortedEvents(events, sortType);

    const eventListElement = dayListItemComponent.getElement().querySelector(`.trip-events__list`);

    sortedEvents.forEach((event) => {
      renderEvent(eventListElement, event);
    });
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
    this._noEventsComponent = new NoEventsComponent();
  }

  render(events) {
    if (events.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._daysListComponent, RenderPosition.BEFOREEND);

    const dayListElement = this._daysListComponent.getElement();

    renderEvents(dayListElement, events, this._sortComponent.getSortType());

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      dayListElement.innerHTML = ``;

      renderEvents(dayListElement, events, sortType);
    });
  }
}
