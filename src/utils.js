const setTimeDateFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = setTimeDateFormat(date.getHours());
  const minutes = setTimeDateFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const calcHoursDifference = (dateFrom, dateTo) => {
  const startTime = formatTime(dateFrom);
  const endTime = formatTime(dateTo);

  const getDate = (string) => new Date(0, 0, 0, string.split(`:`)[0], string.split(`:`)[1]);
  const difference = (getDate(endTime) - getDate(startTime));

  let hours;
  let minutes;

  if (difference > 0) {
    hours = Math.floor((difference % 86400000) / 3600000);
    minutes = Math.round(((difference % 86400000) % 3600000) / 60000);
  } else {
    const differenceAbs = Math.abs(difference);
    hours = Math.floor(24 - (differenceAbs % 86400000) / 3600000);
    minutes = Math.round(60 - ((differenceAbs % 86400000) % 3600000) / 60000);
  }

  return [hours, minutes];
};

export const getDuration = (dateFrom, dateTo) => {
  const daysDifference = dateTo.getDate() - dateFrom.getDate();
  const [hoursDifference, minutesDifference] = calcHoursDifference(dateFrom, dateTo);

  const differenceValues = Array.of(daysDifference, hoursDifference, minutesDifference);

  if (differenceValues[0] === 0) {
    if (differenceValues[1] === 0) {
      return (`${setTimeDateFormat(differenceValues[2])}M`);
    } else {
      return (`${setTimeDateFormat(differenceValues[1])}H ${setTimeDateFormat(differenceValues[2])}M`);
    }
  } else {
    return (`${setTimeDateFormat(differenceValues[0])}D ${setTimeDateFormat(differenceValues[1])}H ${setTimeDateFormat(differenceValues[2])}M`);
  }
};

export const getCapitalizedType = (string) => `${string.substr(0, 1).toUpperCase()}${string.slice(1)}`;

export const createTripTypeTitle = (eventTypes, eventName) => {
  const [event] = eventTypes.filter((eventType) => eventType.name === eventName);
  return event.type === `activity` ? `${getCapitalizedType(event.name)} in` : `${getCapitalizedType(event.name)} to`;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
