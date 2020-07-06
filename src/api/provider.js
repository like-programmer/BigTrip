export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  getPoints() {
    return this._api.getPoints();
  }

  createPoint(point) {
    return this._api.createPoint(point);
  }

  updatePoint(id, point) {
    return this._api.updatePoint(id, point);
  }

  deletePoint(id) {
    return this._api.deletePoint(id);
  }
}
