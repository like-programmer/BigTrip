export const generateEvent = () => {
  return {
    icon: `img/icons/taxi.png`,
    eventName: `taxi`,
    destination: `Amsterdam`,
    endDate: new Date(),
    duration: `30M`,
    price: `20`,
    description: `Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.`,
    photos: [`img/photos/1.jpg`, `img/photos/2.jpg`, `img/photos/3.jpg`],
    offers: [
      {
        type: `taxi`,
        name: `uber`,
        title: `Order Uber`,
        price: 20,
        isChecked: Math.random() > 0.5
      },
      {
        type: `taxi`,
        name: `luggage`,
        title: `Add luggage`,
        price: 10,
        isChecked: Math.random() > 0.5
      }
    ]
  };
};

export const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
