import {createTripInfoTemplate} from "./components/trip-info.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createEditEventTemplate} from "./components/edit-event.js";
import {createDayListTemplate} from "./components/day-list.js";
import {createEventTemplate} from "./components/event.js";


const EVENT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.trip-main`);

render(siteHeaderElement, createTripInfoTemplate(), `afterbegin`);

const siteHeaderHiddenTitles = Array.from(siteHeaderElement.querySelectorAll(`.trip-main__trip-controls.trip-controls .visually-hidden`));

render(siteHeaderHiddenTitles[0], createSiteMenuTemplate(), `afterend`);
render(siteHeaderHiddenTitles[1], createFilterTemplate(), `afterend`);


const eventsContainerElement = document.querySelector(`.trip-events`);

render(eventsContainerElement, createSortingTemplate(), `beforeend`);
render(eventsContainerElement, createEditEventTemplate(), `beforeend`);

render(eventsContainerElement, createDayListTemplate(), `beforeend`);

const eventListElement = eventsContainerElement.querySelector(`.trip-events__list`);

new Array(EVENT_COUNT).fill(``).forEach(() => {
  render(eventListElement, createEventTemplate(), `beforeend`);
});


