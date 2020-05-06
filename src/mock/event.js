import {EVENT_TYPES, DESTINATION_CITIES, OFFER_LIST} from "../const.js";

const descriptionItems = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const getRandomIntegerNumber = (min, max) => {
  return (min + Math.floor(Math.random() * (max - min)));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomDates = () => {
  const startDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const startDiffValue = sign * getRandomIntegerNumber(0, 3);
  startDate.setDate(startDate.getDate() + startDiffValue);

  const endDate = new Date();
  endDate.setDate(startDate.getDate() + getRandomIntegerNumber(0, 3));
  endDate.setHours(endDate.getHours() + getRandomIntegerNumber(0, 3));
  endDate.setMinutes(endDate.getMinutes() + getRandomIntegerNumber(5, 30));

  return [startDate, endDate];
};

const getPhotosArray = () => {
  const itemsCount = getRandomIntegerNumber(4, 8);
  return new Array(itemsCount).fill(``).map(() => {
    return ({
      src: `http://picsum.photos/300/150?r=${Math.random()}`,
      description: getRandomArrayItem(descriptionItems)
    });
  });
};

const getRandomArray = (array) => {
  if (array.length > 0) {
    const itemsCount = getRandomIntegerNumber(0, array.length - 1);
    return new Array(itemsCount).fill(``).map((it, i) => {
      return array[i];
    });
  } else {
    return [];
  }
};

const getRandomString = (array) => {
  const itemsCount = getRandomIntegerNumber(1, 3);
  return new Array(itemsCount).fill(``).map(() => {
    return getRandomArrayItem(array);
  }).join(` `);
};

export const generateEvent = () => {
  const dates = getRandomDates();
  const eventType = getRandomArrayItem(EVENT_TYPES);
  const [filteredOfferList] = OFFER_LIST.filter((it) => it.type === eventType.name);
  const randomCheckedOfferList = getRandomArray(filteredOfferList.offers);

  return {
    basePrice: getRandomIntegerNumber(50, 500),
    dateFrom: dates[0],
    dateTo: dates[1],
    destination: {
      description: getRandomString(descriptionItems),
      name: getRandomArrayItem(DESTINATION_CITIES),
      pictures: getPhotosArray()
    },
    isFavourite: Math.random() > 0.5,
    offers: randomCheckedOfferList,
    type: eventType.name
  };
};

export const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
