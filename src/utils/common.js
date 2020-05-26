import moment from "moment";

export const getDuration = (dateFrom, dateTo) => {
  const startDate = moment(dateFrom);
  const endDate = moment(dateTo);
  const duration = moment.duration(endDate.diff(startDate));
  const days = duration._data.days > 0 ? `${duration._data.days}D ` : ``;
  const hours = duration._data.hours > 0 ? `${duration._data.hours}H ` : ``;
  const minutes = duration._data.minutes > 0 ? `${duration._data.minutes}M` : ``;

  return `${days}${hours}${minutes}`;
};

export const getCapitalizedType = (string) => `${string.substr(0, 1).toUpperCase()}${string.slice(1)}`;

export const createTripTypeTitle = (eventTypes, eventName) => {
  const [event] = eventTypes.filter((eventType) => eventType.name === eventName);
  return event.type === `activity` ? `${getCapitalizedType(event.name)} in` : `${getCapitalizedType(event.name)} to`;
};

export const getOrderedEvents = (events) => {
  const eventArray = events.slice();
  return eventArray.sort((first, second) => first.dateFrom - second.dateFrom);
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
