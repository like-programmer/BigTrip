import {createTripInfoTemplate} from "./components/trip-info.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createListTemplate} from "./components/list.js";
import {createEditCardTemplate} from "./components/edit-card.js";
import {createCardTemplate} from "./components/card.js";


const CARD_COUNT = 3;

const render = (container, template, place) => {
    container.insertAdjacentHTML(place, template)
};

const siteEditedHeader = document.querySelector(`.trip-main`);

render(siteEditedHeader, createTripInfoTemplate(), `afterbegin`);

const siteHeaderHiddenTitles = siteEditedHeader.querySelectorAll(".trip-main__trip-controls.trip-controls .visually-hidden");

for (let i = 0; i < siteHeaderHiddenTitles.length; i++) {
    switch (i) {
        case 0:
            render(siteHeaderHiddenTitles[i], createSiteMenuTemplate(), `afterend`);
            break;

        case 1:
            render(siteHeaderHiddenTitles[i], createFilterTemplate(), `afterend`);
            break;
    }
}

const eventsContainer = document.querySelector(".trip-events");

render(eventsContainer, createListTemplate(), `beforeend`);

const sortForm = eventsContainer.querySelector(".trip-events__trip-sort.trip-sort");

render(sortForm, createEditCardTemplate(), `afterend`);

const eventList = eventsContainer.querySelector(".trip-events__list");

new Array(CARD_COUNT).fill(``).forEach(() => {
    render(eventList, createCardTemplate(), `beforeend`);
});


