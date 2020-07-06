import Point from "../models/point.js";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
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
      // return this._api.getOffers()
      //   .then((offers) => {
      //     this._store.setItems(offers);
      //
      //     return offers;
      //   });
    }

    // TODO: Write logic if internet is unavailable
    return Promise.reject(`Offline logic is not implemented`);
    // const storeOffers = Object.values(this._store.getItems());
    // return Promise.resolve(storeOffers);
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.forEach((point) => this._store.setItem(point.id, point.toRAW()));

          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(Point.parsePoints(storePoints));
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