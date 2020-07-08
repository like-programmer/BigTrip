import moment from "moment";

let lastTimeout;

export const debounce = (action) => {
  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }

  lastTimeout = window.setTimeout(() => {
    action();
  }, 500);
};

const getFormattedNumber = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const getDuration = (dateFrom, dateTo) => {
  const startDate = moment(dateFrom);
  const endDate = moment(dateTo);
  const duration = moment.duration(endDate.diff(startDate));

  const days = duration.days() > 0 ? `${getFormattedNumber(duration.days())}D ` : ``;
  const hours = duration.hours() > 0 ? `${getFormattedNumber(duration.hours())}H ` : ``;
  const minutes = duration.minutes() > 0 ? `${getFormattedNumber(duration.minutes())}M` : `00M`;

  return `${days}${hours}${minutes}`;
};

export const getCapitalizedType = (string) => `${string.substr(0, 1).toUpperCase()}${string.slice(1)}`;

export const createTripTypeTitle = (pointTypes, pointName) => {
  const [point] = pointTypes.filter((pointType) => pointType.name === pointName);
  return point.type === `activity` ? `${getCapitalizedType(point.name)} in` : `${getCapitalizedType(point.name)} to`;
};

export const getOrderedPoints = (points) => {
  const pointArray = points.slice();
  return pointArray.sort((first, second) => {
    const dateA = new Date(first.dateFrom);
    const dateB = new Date(second.dateFrom);

    return dateA - dateB;
  });
};

export const isPastPoint = (pointDate, date) => {
  const startDate = new Date(pointDate);
  return startDate < date;
};

export const isFuturePoint = (pointDate, date) => {
  const endDate = new Date(pointDate);
  return endDate > date;
};
