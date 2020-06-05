import TripInfoComponent from "./components/trip-info.js";
import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";

import TripController from "./controllers/trip.js";

import PointsModel from "./models/points.js";

import {generatePoints} from "./mock/event.js";

import {FILTER_NAMES} from "./const.js";
import {RenderPosition, render} from "./utils/render.js";

const POINT_COUNT = 4;
const points = generatePoints(POINT_COUNT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const siteHeaderElement = document.querySelector(`.trip-main`);

render(siteHeaderElement, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);

const siteHeaderControls = siteHeaderElement.querySelector(`.trip-main__trip-controls.trip-controls`);

render(siteHeaderControls, new SiteMenuComponent(), RenderPosition.AFTERBEGIN);
const hiddenTitle = siteHeaderControls.querySelector(`.visually-hidden`);
siteHeaderControls.replaceChild(siteHeaderControls.querySelector(`nav`), hiddenTitle);
siteHeaderControls.prepend(hiddenTitle);

render(siteHeaderControls, new FilterComponent(FILTER_NAMES), RenderPosition.BEFOREEND);

const pointsContainerElement = document.querySelector(`.trip-events`);
const tripController = new TripController(pointsContainerElement, pointsModel);
tripController.render();

