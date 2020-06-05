import {getRandomIntegerNumber, getRandomArrayItem, getRandomString} from "./utils/common.js";

const DESCRIPTION_ITEMS = [
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

const DESTINATION_CITIES = [`Amsterdam`, `Chamonix`, `Geneva`, `Rotterdam`, `Strasbourg`, `Zürich`, `Sydney`, `Kyoto`, `Praha`];

export const POINT_TYPES = [
  {
    name: `check-in`,
    icon: `img/icons/check-in.png`,
    type: `activity`
  },
  {
    name: `sightseeing`,
    icon: `img/icons/sightseeing.png`,
    type: `activity`
  },
  {
    name: `restaurant`,
    icon: `img/icons/restaurant.png`,
    type: `activity`
  },
  {
    name: `taxi`,
    icon: `img/icons/taxi.png`,
    type: `transfer`
  },
  {
    name: `bus`,
    icon: `img/icons/bus.png`,
    type: `transfer`
  },
  {
    name: `train`,
    icon: `img/icons/train.png`,
    type: `transfer`
  },
  {
    name: `ship`,
    icon: `img/icons/ship.png`,
    type: `transfer`
  },
  {
    name: `transport`,
    icon: `img/icons/transport.png`,
    type: `transfer`
  },
  {
    name: `drive`,
    icon: `img/icons/drive.png`,
    type: `transfer`
  },
  {
    name: `flight`,
    icon: `img/icons/flight.png`,
    type: `transfer`
  }
];

export const MONTH_NAMES = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUN`,
  `JUL`,
  `AUG`,
  `SEP`,
  `OCT`,
  `NOV`,
  `DEC`
];

const getPhotosArray = () => {
  const itemsCount = getRandomIntegerNumber(4, 8);
  return new Array(itemsCount).fill(``).map(() => {
    return ({
      src: `http://picsum.photos/300/150?r=${Math.random()}`,
      description: getRandomArrayItem(DESCRIPTION_ITEMS)
    });
  });
};

export const DESTINATION_ITEMS = [];
DESTINATION_CITIES.forEach((city) => DESTINATION_ITEMS.push({
  description: getRandomString(DESCRIPTION_ITEMS),
  name: city,
  pictures: getPhotosArray()
}));

export const FILTER_NAMES = [`everything`, `future`, `past`];

export const OFFER_LIST = [
  {
    type: `check-in`,
    offers: [
      {
        title: `Add breakfast`,
        price: 45
      }
    ]
  },
  {
    type: `sightseeing`,
    offers: [
      {
        title: `Book tickets`,
        price: 30
      },
      {
        title: `Lunch in city`,
        price: 65
      }
    ]
  },
  {
    type: `restaurant`,
    offers: []
  },
  {
    type: `taxi`,
    offers: [
      {
        title: `Upgrade to a comfort class`,
        price: 120
      },
      {
        title: `Choose the radio station`,
        price: 60
      },
      {
        title: `Order Uber`,
        price: 20
      }
    ]
  },
  {
    type: `bus`,
    offers: []
  },
  {
    type: `train`,
    offers: []
  },
  {
    type: `ship`,
    offers: []
  },
  {
    type: `transport`,
    offers: []
  },
  {
    type: `drive`,
    offers: [
      {
        title: `Rent a car`,
        price: 200
      },
    ]
  },
  {
    type: `flight`,
    offers: [
      {
        title: `Add luggage`,
        price: 50
      },
      {
        title: `Switch to a comfort class`,
        price: 100
      },
      {
        title: `Choose seats`,
        price: 5
      },
      {
        title: `Add meal`,
        price: 15
      },
    ]
  }
];
