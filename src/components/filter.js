import {createElement} from "../utils";

const createFilterMarkup = (filterName, isChecked) => {
  return (`
  <div class="trip-filters__filter">
      <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio"
             name="trip-filter" value="${filterName}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
  </div>
  `);
};

const createFilterTemplate = (filterNames) => {
  const filterMarkup = filterNames.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (`<form class="trip-filters" action="#" method="get">
        ${filterMarkup}

        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`);
};

export default class Filter {
  constructor(filterNames) {
    this._filterNames = filterNames;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filterNames);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
