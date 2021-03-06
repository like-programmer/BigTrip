import AbstractComponent from "./abstract-component.js";
import {FILTER_ID_PREFIX} from "../const.js";

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterMarkup = (filter, isChecked) => {
  return (`
  <div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${isChecked ? `checked` : ``} ${filter.count === 0 ? `disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
  </div>
  `);
};

const createFilterTemplate = (filters) => {
  const filterMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return (`<form class="trip-filters" action="#" method="get">
        ${filterMarkup}

        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`);
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
