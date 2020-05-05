const destinationItems = [`Amsterdam`, `Chamonix`, `Geneva`, `Rotterdam`, `Strasbourg`, `Zürich`, `Sydney`, `Kyoto`, `Praha`];

const offerItems = [
  {
    type: `check`,
    name: `breakfast`,
    title: `Add breakfast`,
    price: 45,
    isChecked: Math.random() > 0.5
  },
  {
    type: `sightseeing`,
    name: `tickets`,
    title: `Book tickets`,
    price: 30,
    isChecked: Math.random() > 0.5
  },
  {
    type: `sightseeing`,
    name: `lunch`,
    title: `Lunch in city`,
    price: 65,
    isChecked: Math.random() > 0.5
  },
  {
    type: `restaurant`,
    name: `reserve`,
    title: `Reserve a table`,
    price: 65,
    isChecked: Math.random() > 0.5
  },
  {
    type: `taxi`,
    name: `uber`,
    title: `Order Uber`,
    price: 20,
    isChecked: Math.random() > 0.5
  },
  {
    type: `bus`,
    name: `travel-card`,
    title: `Buy a travel card`,
    price: 15,
    isChecked: Math.random() > 0.5
  },
  {
    type: `train`,
    name: `meal`,
    title: `Add meal`,
    price: 10,
    isChecked: Math.random() > 0.5
  },
  {
    type: `ship`,
    name: `seats`,
    title: `Choose seats`,
    price: 25,
    isChecked: Math.random() > 0.5
  },
  {
    type: `transport`,
    name: `seats`,
    title: `Choose seats`,
    price: 5,
    isChecked: Math.random() > 0.5
  },
  {
    type: `drive`,
    name: `rent`,
    title: `Rent a car`,
    price: 200,
    isChecked: Math.random() > 0.5
  },
  {
    type: `flight`,
    name: `luggage`,
    title: `Add luggage`,
    price: 50,
    isChecked: Math.random() > 0.5
  },
  {
    type: `flight`,
    name: `comfort`,
    title: `Switch to comfort class`,
    price: 100,
    isChecked: Math.random() > 0.5
  }
];

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

const getRandomArray = () => {
  const itemsCount = getRandomIntegerNumber(1, 7);
  return new Array(itemsCount).fill(``).map(() => {
    return `http://picsum.photos/300/150?r=${Math.random()}`;
  });
};

const getRandomString = (array) => {
  const itemsCount = getRandomIntegerNumber(1, 3);
  return new Array(itemsCount).fill(``).map(() => {
    return getRandomArrayItem(array);
  }).join(` `);
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

export const generateEvent = () => {
  const dates = getRandomDates();

  return {
    icon: `img/icons/taxi.png`,
    eventName: `taxi`,
    destination: getRandomArrayItem(destinationItems),
    startDate: dates[0],
    endDate: dates[1],
    price: getRandomIntegerNumber(5, 60),
    description: getRandomString(descriptionItems),
    photos: getRandomArray(),
    offers: []
  };
};

export const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
