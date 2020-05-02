const createFilterMarkup = (filterName) => {
  return (`
  <div class="trip-filters__filter">
                        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio"
                               name="trip-filter" value="everything" checked>
                        <label class="trip-filters__filter-label" for="filter-everything">${filterName}</label>
                    </div>
  `);
};

export const createFilterTemplate = (filterNames) => {
  const filterMarkup = filterNames.map((it) => createFilterMarkup(it)).join(`\n`);

  return (`
    <form class="trip-filters" action="#" method="get">
                    ${filterMarkup}

                    <button class="visually-hidden" type="submit">Accept filter</button>
                </form>
    `);
};
