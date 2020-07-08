export default class Store {
  constructor(key, storage) {
    this._storeKey = key;
    this._storage = storage;
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(`${this._storeKey}/destinations`));
    } catch (error) {
      return {};
    }
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(`${this._storeKey}/offers`));
    } catch (error) {
      return {};
    }
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (error) {
      return {};
    }
  }

  setDestinations(items) {
    this._storage.setItem(
        `${this._storeKey}/destinations`,
        JSON.stringify(items)
    );
  }

  setOffers(items) {
    this._storage.setItem(
        `${this._storeKey}/offers`,
        JSON.stringify(items)
    );
  }

  setItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
