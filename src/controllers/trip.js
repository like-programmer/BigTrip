import SortComponent from "../components/sort";
import DaysListComponent from "../components/days-list";
import DayListItemComponent from "../components/day-list-item";
import EventComponent from "../components/event.js";
import EditEventComponent from "../components/edit-event.js";
import NoEventsComponent from "../components/no-events";

import {RenderPosition, render, replace} from "../utils/render.js";


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

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(events) {
    if (events.length > 0) {
      render(this._container, new SortComponent(), RenderPosition.BEFOREEND);

      const daysListComponent = new DaysListComponent();
      render(this._container, daysListComponent, RenderPosition.BEFOREEND);

      const dayListElement = daysListComponent.getElement();

      const getuniqueArray = (array) => {
        return Array.from(new Set(array));
      };

      const eventDatesFrom = events.map((it) => {
        return it.dateFrom.toISOString().split(`.`)[0];
      });

      const uniqueEventDatesFrom = getuniqueArray(eventDatesFrom);

      uniqueEventDatesFrom.forEach((date, i) => {
        const dayListComponent = new DayListItemComponent(date, i);
        render(dayListElement, dayListComponent, RenderPosition.BEFOREEND);

        const groupedEventByDate = events.filter((event) => {
          return date === event.dateFrom.toISOString().split(`.`)[0];
        });

        const eventListElement = dayListComponent.getElement().querySelector(`.trip-events__list`);
        groupedEventByDate.forEach((event) => {
          renderEvent(eventListElement, event);
        });
      });
    } else {
      render(this._container, new NoEventsComponent(), RenderPosition.BEFOREEND);

    }
  }
}
