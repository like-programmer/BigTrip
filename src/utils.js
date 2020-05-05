const calcHoursDifference = (startDate, endDate) => {
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);

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

export const setTimeDateFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = setTimeDateFormat(date.getHours());
  const minutes = setTimeDateFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDateYMD = (date) => {
  const year = date.getFullYear();
  const month = parseInt(date.getMonth(), 10) + 1;
  const formattedMonth = setTimeDateFormat(month);
  const day = setTimeDateFormat(date.getDate());
  return `${year}-${formattedMonth}-${day}`;
};

export const formatDateDMY = (date) => {
  const day = setTimeDateFormat(date.getDate());
  const month = parseInt(date.getMonth(), 10) + 1;
  const formattedMonth = setTimeDateFormat(month);
  const year = date.getFullYear();
  const formattedYear = year.toString().slice(0, 2);


  return `${day}/${formattedMonth}/${formattedYear}`;
};

export const getDuration = (startDate, endDate) => {
  const daysDifference = endDate.getDate() - startDate.getDate();
  const [hoursDifference, minutesDifference] = calcHoursDifference(startDate, endDate);

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

export const createTripTypeTitle = (eventTypes, eventName) => {
  const [event] = eventTypes.filter((eventType) => eventType.name === eventName);
  return event.type === `stop` ? `${event.title} in` : `${event.title} to`;
};
