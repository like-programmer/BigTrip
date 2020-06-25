import SiteMenuComponent from "./components/site-menu.js";
import StatisticsComponent from "./components/statistics.js";
import TripInfoController from "./controllers/trip-info.js";
import FilterController from "./controllers/filter.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import {generatePoints} from "./mock/event.js";
import {RenderPosition, render} from "./utils/render.js";
import {MenuItem} from "./const.js";

const POINT_COUNT = 4;

const points = generatePoints(POINT_COUNT);
const pointsModel = new PointsModel();

pointsModel.setPoints(points);

const siteHeaderElement = document.querySelector(`.trip-main`);
const siteHeaderControls = siteHeaderElement.querySelector(`.trip-main__trip-controls.trip-controls`);
const hiddenTitle = siteHeaderControls.querySelector(`.visually-hidden`);
const pointsContainerElement = document.querySelector(`.trip-events`);
const pageBodyElement = document.querySelector(`.page-body__page-main.page-main .page-body__container`);
const addEventBtnElement = siteHeaderElement.querySelector(`.trip-main__event-add-btn`);

const tripInfoController = new TripInfoController(siteHeaderElement, pointsModel);
const siteMenuComponent = new SiteMenuComponent();
const statisticsComponent = new StatisticsComponent();
const tripController = new TripController(pointsContainerElement, pointsModel);
const filterController = new FilterController(siteHeaderControls, pointsModel);


tripInfoController.render();
render(siteHeaderControls, siteMenuComponent, RenderPosition.AFTERBEGIN);
siteHeaderControls.replaceChild(siteHeaderControls.querySelector(`nav`), hiddenTitle);
siteHeaderControls.prepend(hiddenTitle);
filterController.render();
tripController.render();
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

