import AbstractComponent from "./abstract-component.js";

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

export default class Filter extends AbstractComponent {
  constructor(filterNames) {
    super();
    this._filterNames = filterNames;
  }

  getTemplate() {
    return createFilterTemplate(this._filterNames);
  }
}
