import Point from "./models/point.js";

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getDestinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://htmlacademy-es-10.appspot.com/big-trip/destinations`, {headers})
      .then((response) => response.json());
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://htmlacademy-es-10.appspot.com/big-trip/offers`, {headers})
      .then((response) => response.json());
  }

  getPoints() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://htmlacademy-es-10.appspot.com/big-trip/points`, {headers})
      .then((response) => response.json())
      .then(Point.parsePoints);
  }

  updatePoint(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://htmlacademy-es-10.appspot.com/big-trip/points/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data),
      headers,
    })
      .then((response) => response.json())
      .then(Point.parsePoints);
  }
};

export default API;
