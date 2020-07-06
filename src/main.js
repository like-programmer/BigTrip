import API from "./api/index.js";
import SiteMenuComponent from "./components/site-menu.js";
import StatisticsComponent from "./components/statistics.js";
import TripInfoController from "./controllers/trip-info.js";
import FilterController from "./controllers/filter.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import OffersModel from "./models/offers.js";
import DestinationsModel from "./models/destinations.js";
import {render} from "./utils/render.js";
import {MenuItem, RenderPosition, AUTHORIZATION, END_POINT} from "./const.js";

const api = new API(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const siteHeaderElement = document.querySelector(`.trip-main`);
const siteHeaderControls = siteHeaderElement.querySelector(`.trip-main__trip-controls.trip-controls`);
const hiddenTitle = siteHeaderControls.querySelector(`.visually-hidden`);
const pageBodyElement = document.querySelector(`.page-body__page-main.page-main .page-body__container`);
const addEventBtnElement = siteHeaderElement.querySelector(`.trip-main__event-add-btn`);
const pointsContainerElement = document.querySelector(`.trip-events`);

const tripInfoController = new TripInfoController(siteHeaderElement, pointsModel);
const siteMenuComponent = new SiteMenuComponent();
const filterController = new FilterController(siteHeaderControls, pointsModel);
const statisticsComponent = new StatisticsComponent();
const tripController = new TripController(pointsContainerElement, pointsModel, offersModel, destinationsModel, api);

tripInfoController.render();
render(hiddenTitle, siteMenuComponent, RenderPosition.AFTEREND);
filterController.render();
render(pageBodyElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

addEventBtnElement.addEventListener(`click`, () => {
  tripController.createPoint();
  addEventBtnElement.setAttribute(`disabled`, `disabled`);
});

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      siteMenuComponent.setActiveItem(MenuItem.POINTS);
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATISTICTS:
      siteMenuComponent.setActiveItem(MenuItem.STATISTICTS);
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});


api.getDestinations()
  .then((destinations) => destinationsModel.setDestinations(destinations))
  .then(() => api.getOffers())
  .then((offers) => offersModel.setOffers(offers))
  .then(() => api.getPoints())
  .then((points) => pointsModel.setPoints(points))
  .then(() => {
    pointsContainerElement.removeChild(pointsContainerElement.querySelector(`.trip-events__msg`));
    tripController.render();
  });
