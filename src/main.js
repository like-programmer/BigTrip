import TripInfoComponent from "./components/trip-info.js";
import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";
import SortComponent from "./components/sort.js";
import DaysListComponent from "./components/days-list.js";
import DayListItemComponent from "./components/day-list-item.js";
import EditEventComponent from "./components/edit-event.js";
import EventComponent from "./components/event.js";
import NoEventsComponent from "./components/no-events.js";

import {generateEvents} from "./mock/event.js";

import {FILTER_NAMES} from "./const.js";
import {RenderPosition, render} from "./utils/render.js";

const EVENT_COUNT = 4;

const sortedEvents = generateEvents(EVENT_COUNT).sort((first, second) => first.dateFrom - second.dateFrom);

const renderEvent = (dayElement, event) => {
  const replaceEventToEdit = () => {
    dayElement.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
  };

  const replaceEditToEvent = () => {
    dayElement.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
  };

  const documentEscKeydownHandler = (evt) => {
    const isEsc = evt.key === `Escape` || evt.key === `Esc`;
    if (isEsc) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, documentEscKeydownHandler);
    }
  };

  const eventComponent = new EventComponent(event);
  const editBtn = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editBtn.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, documentEscKeydownHandler);
  });

  const editEventComponent = new EditEventComponent(event);
  const editForm = editEventComponent.getElement().querySelector(`.event.event--edit`);
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, documentEscKeydownHandler);
  });
  const closeForm = editEventComponent.getElement().querySelector(`.event__rollup-btn`);
  closeForm.addEventListener(`click`, () => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, documentEscKeydownHandler);
  });

  render(dayElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector(`.trip-main`);

render(siteHeaderElement, new TripInfoComponent(sortedEvents).getElement(), RenderPosition.AFTERBEGIN);

const siteHeaderControls = siteHeaderElement.querySelector(`.trip-main__trip-controls.trip-controls`);

render(siteHeaderControls, new SiteMenuComponent().getElement(), RenderPosition.AFTERBEGIN);
const hiddenTitle = siteHeaderControls.querySelector(`.visually-hidden`);
siteHeaderControls.replaceChild(siteHeaderControls.querySelector(`nav`), hiddenTitle);
siteHeaderControls.prepend(hiddenTitle);

render(siteHeaderControls, new FilterComponent(FILTER_NAMES).getElement(), RenderPosition.BEFOREEND);

const eventsContainerElement = document.querySelector(`.trip-events`);

if (sortedEvents.length > 0) {
  render(eventsContainerElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

  const daysListComponent = new DaysListComponent();
  render(eventsContainerElement, daysListComponent.getElement(), RenderPosition.BEFOREEND);

  const dayListElement = daysListComponent.getElement();

  const getuniqueArray = (array) => {
    return Array.from(new Set(array));
  };

  const eventDatesFrom = sortedEvents.map((it) => {
    return it.dateFrom.toISOString().split(`.`)[0];
  });

  const uniqueEventDatesFrom = getuniqueArray(eventDatesFrom);

  uniqueEventDatesFrom.forEach((date, i) => {
    const dayListComponent = new DayListItemComponent(date, i);
    render(dayListElement, dayListComponent.getElement(), RenderPosition.BEFOREEND);

    const groupedEventByDate = sortedEvents.filter((event) => {
      return date === event.dateFrom.toISOString().split(`.`)[0];
    });

    const eventListElement = dayListComponent.getElement().querySelector(`.trip-events__list`);
    groupedEventByDate.forEach((event) => {
      renderEvent(eventListElement, event);
    });
  });
} else {
  render(eventsContainerElement, new NoEventsComponent().getElement(), RenderPosition.BEFOREEND);

}
