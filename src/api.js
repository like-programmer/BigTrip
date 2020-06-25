const API = class {
  constructor() {
    this._authorization = authorization;
  }

  getPoints() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://htmlacademy-es-10.appspot.com/big-trip/`, {headers})
      .then((response) => response.json());
  }
};

export default API;
