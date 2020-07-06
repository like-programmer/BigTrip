const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations();
    }

    // TODO: Write logic if internet is unavailable
    return Promise.reject(`Offline logic is not implemented`);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers();
    }

    // TODO: Write logic if internet is unavailable
    return Promise.reject(`Offline logic is not implemented`);
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints();
    }

    // TODO: Write logic if internet is unavailable
    return Promise.reject(`Offline logic is not implemented`);
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point);
    }

    // TODO: Write logic if internet is unavailable
    return Promise.reject(`Offline logic is not implemented`);
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point);
    }

    // TODO: Write logic if internet is unavailable
    return Promise.reject(`Offline logic is not implemented`);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id);
    }

    // TODO: Write logic if internet is unavailable
    return Promise.reject(`Offline logic is not implemented`);
  }
}
