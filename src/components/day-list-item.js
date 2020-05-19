import {MONTH_NAMES} from "../const.js";
import AbstractComponent from "./abstract-component.js";

const createDayListItemTemplate = (date, index) => {
  const dayNumber = date ? (index + 1) : ``;

  const dateTime = date ? (date.split(`T`)[0]) : ``;

  const dayDate = date ? (dateTime.split(`-`)[2]) : ``;
  const formattedDayDate = parseInt(dayDate, 10) < 10 ? dayDate.slice(1) : dayDate;

  const month = date ? (MONTH_NAMES[parseInt((dateTime.split(`-`)[1]), 10) - 1]) : ``;

  return (`<li class="trip-days__item  day">
    <div class="day__info">
        ${date ? `<span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="2019-03-18">${formattedDayDate} ${month}</time>` : ``}
    </div>

    <ul class="trip-events__list"></ul>
  </li>`);
};

export default class DayListItem extends AbstractComponent {
  constructor(date, index) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createDayListItemTemplate(this._date, this._index);
  }
}
