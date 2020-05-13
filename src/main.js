import TripInfoComponent from "./components/trip-info.js";
import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";
import SortComponent from "./components/sort.js";
import DaysListComponent from "./components/days-list.js";
import DayListItemComponent from "./components/day-list-item.js";
import EditEventComponent from "./components/edit-event.js";
import EventComponent from "./components/event.js";

import {generateEvents} from "./mock/event.js";
import {FILTER_NAMES} from "./mock/filter.js";

import {RenderPosition, render} from "./utils.js";

const EVENT_COUNT = 4;

const events = generateEvents(EVENT_COUNT);

const eventsCopy = events.slice();
const sortedEvents = eventsCopy.sort((first, second) => first.dateFrom - second.dateFrom);

const renderEvent = (dayElement, event) => {
  const editBtnClickHandler = () => {
    dayElement.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
  };

  const editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    dayElement.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
  };

  const eventComponent = new EventComponent(event);
  const editBtn = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editBtn.addEventListener(`click`, editBtnClickHandler);

  const editEventComponent = new EditEventComponent(event);
  const editForm = editEventComponent.getElement().querySelector(`.event.event--edit`);
  editForm.addEventListener(`submit`, editFormSubmitHandler);
  const closeForm = editEventComponent.getElement().querySelector(`.event__rollup-btn`);
  closeForm.addEventListener(`click`, editFormSubmitHandler);

  render(dayElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};
const renderDayList = () => {
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

render(eventsContainerElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);


//
//
//


render(eventsContainerElement, new DaysListComponent().getElement(), RenderPosition.BEFOREEND);
const dayListElement = eventsContainerElement.querySelector(`.trip-days`);

const getuniqueArray = (array) => {
  return Array.from(new Set(array));
};

const eventDatesFrom = sortedEvents.map((it) => {
  return it.dateFrom.toISOString().split(`.`)[0];
});

const uniqueEventDatesFrom = getuniqueArray(eventDatesFrom);
render(dayListElement, new DayListItemComponent(uniqueEventDatesFrom[0], 0).getElement(), RenderPosition.BEFOREEND);

const eventListElement = dayListElement.querySelector(`.trip-events__list`);
renderEvent(eventListElement, events[0]);

