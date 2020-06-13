import {POINT_TYPES, OFFER_LIST, DESTINATION_ITEMS} from "../const.js";
import {getRandomIntegerNumber, getRandomArrayItem} from "../utils/common.js";

const getRandomDates = () => {
  const startDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const startDiffValue = sign * getRandomIntegerNumber(0, 3);
  startDate.setDate(startDate.getDate() + startDiffValue);
  startDate.setHours(startDate.getHours() + getRandomIntegerNumber(0, 3));
  startDate.setMinutes(startDate.getMinutes() + getRandomIntegerNumber(5, 30));

  const endDate = new Date();
  endDate.setDate(startDate.getDate() + getRandomIntegerNumber(0, 1));
  endDate.setHours(startDate.getHours() + getRandomIntegerNumber(0, 3));
  endDate.setMinutes(startDate.getMinutes() + getRandomIntegerNumber(5, 30));

  return [startDate, endDate];
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

export const generatePoint = () => {
  const dates = getRandomDates();
  const pointType = getRandomArrayItem(POINT_TYPES);
  const [filteredOfferList] = OFFER_LIST.filter((it) => it.type === pointType.name);
  const randomCheckedOfferList = getRandomArray(filteredOfferList.offers);

  return {
    id: String(new Date() + Math.random()),
    basePrice: getRandomIntegerNumber(50, 500),
    dateFrom: dates[0].toISOString(),
    dateTo: dates[1].toISOString(),
    destination: getRandomArrayItem(DESTINATION_ITEMS),
    isFavourite: Math.random() > 0.5,
    offers: randomCheckedOfferList,
    type: pointType.name
  };
};

export const generatePoints = (count) => {
  return new Array(count).fill(``).map(generatePoint);
};
