import TripInfoComponent from "../components/trip-info.js";
import {RenderPosition} from "../const.js";
import {render, replace} from "../utils/render.js";

export default class TripInfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);

    this._pointsModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    const allPoints = this._pointsModel.getPointsAll();

    const oldComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoComponent(allPoints);

    if (oldComponent) {
      replace(this._tripInfoComponent, oldComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _dataChangeHandler() {
    this.render();
  }
}
