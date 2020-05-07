import {MONTH_NAMES} from "../const.js";

export const createDayListTemplate = (date, index) => {
  const dayNumber = index + 1;

  const dateTime = date.split(`T`)[0];

  const dayDate = dateTime.split(`-`)[2];
  const formattedDayDate = parseInt(dayDate, 10) < 10 ? dayDate.slice(1) : dayDate;

  const month = MONTH_NAMES[parseInt((dateTime.split(`-`)[1]), 10) - 1];

  return (`
  <li class="trip-days__item  day">
    <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="2019-03-18">${formattedDayDate} ${month}</time>
    </div>

    <ul class="trip-events__list"></ul>
  </li>
    `);
};
