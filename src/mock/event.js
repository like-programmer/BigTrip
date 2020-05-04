export const generateEvent = () => {
  return {
    icon: `img/icons/taxi.png`,
    eventType: `Taxi to `,
    destination: `Amsterdam`,
    endDate: new Date(),
    duration: `30M`,
    price: `20`,
    description: `Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.`
  };
};

export const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
