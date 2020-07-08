import moment from "moment";

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

export const getRandomIntegerNumber = (min, max) => {
  return (min + Math.floor(Math.random() * (max - min)));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomString = (array) => {
  const itemsCount = getRandomIntegerNumber(1, 3);
  return new Array(itemsCount).fill(``).map(() => {
    return getRandomArrayItem(array);
  }).join(` `);
};

export const isPastPoint = (pointDate, date) => {
  const startDate = new Date(pointDate);
  return startDate < date;
};

export const isFuturePoint = (pointDate, date) => {
  const endDate = new Date(pointDate);
  return endDate > date;
};
