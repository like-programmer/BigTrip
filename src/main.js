import {createTripInfoTemplate} from "./components/trip-info.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortTemplate} from "./components/sort.js";
import {createEditEventTemplate} from "./components/edit-event.js";
import {createDayListItemTemplate} from "./components/day-list-item.js";
import {createEventTemplate} from "./components/event.js";

import {generateEvents} from "./mock/event.js";
import {FILTER_NAMES} from "./mock/filter.js";


const EVENT_COUNT = 4;

const events = generateEvents(EVENT_COUNT);

const eventsCopy = events.slice();
const sortedEvents = eventsCopy.sort((first, second) => first.dateFrom - second.dateFrom);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.trip-main`);

render(siteHeaderElement, createTripInfoTemplate(sortedEvents), `afterbegin`);

const siteHeaderHiddenTitles = Array.from(siteHeaderElement.querySelectorAll(`.trip-main__trip-controls.trip-controls .visually-hidden`));

render(siteHeaderHiddenTitles[0], createSiteMenuTemplate(), `afterend`);
render(siteHeaderHiddenTitles[1], createFilterTemplate(FILTER_NAMES), `afterend`);


const eventsContainerElement = document.querySelector(`.trip-events`);

render(eventsContainerElement, createSortTemplate(), `beforeend`);

const dayListElement = eventsContainerElement.querySelector(`.trip-days`);

const getuniqueArray = (array) => {
  return Array.from(new Set(array));
};

const eventDatesFrom = sortedEvents.map((it) => {
  return it.dateFrom.toISOString().split(`.`)[0];
});

const uniqueEventDatesFrom = getuniqueArray(eventDatesFrom);

uniqueEventDatesFrom.forEach((date, i) => {
  render(dayListElement, createDayListItemTemplate(date, i), `beforeend`);

  const eventListElement = eventsContainerElement.querySelectorAll(`.trip-events__list`);

  const groupedEventByDate = sortedEvents.filter((event) => {
    return date === event.dateFrom.toISOString().split(`.`)[0];
  });

  let eventsForRender;

  if (i === 0) {
    render(eventListElement[0], createEditEventTemplate(sortedEvents[0]), `beforeend`);
    eventsForRender = groupedEventByDate.slice(1);
  } else {
    eventsForRender = groupedEventByDate;
  }

  eventsForRender.forEach((event) => {
    render(eventListElement[i], createEventTemplate(event), `beforeend`);
  });
});
