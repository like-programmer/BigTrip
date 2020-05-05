import {createTripInfoTemplate} from "./components/trip-info.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createEditEventTemplate} from "./components/edit-event.js";
import {createDayListTemplate} from "./components/day-list.js";
import {createEventTemplate} from "./components/event.js";

import {generateEvents} from "./mock/event.js";
import {FILTER_NAMES} from "./mock/filter.js";


const EVENT_COUNT = 3;

const events = generateEvents(EVENT_COUNT);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.trip-main`);

render(siteHeaderElement, createTripInfoTemplate(events), `afterbegin`);

const siteHeaderHiddenTitles = Array.from(siteHeaderElement.querySelectorAll(`.trip-main__trip-controls.trip-controls .visually-hidden`));

render(siteHeaderHiddenTitles[0], createSiteMenuTemplate(), `afterend`);
render(siteHeaderHiddenTitles[1], createFilterTemplate(FILTER_NAMES), `afterend`);


const eventsContainerElement = document.querySelector(`.trip-events`);

render(eventsContainerElement, createSortingTemplate(), `beforeend`);
render(eventsContainerElement, createEditEventTemplate(events[0]), `beforeend`);

render(eventsContainerElement, createDayListTemplate(), `beforeend`);

const eventListElement = eventsContainerElement.querySelector(`.trip-events__list`);

events.slice(1).forEach((event) => {
  render(eventListElement, createEventTemplate(event), `beforeend`);
});


