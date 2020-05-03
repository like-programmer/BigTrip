export const generateEvent = () => {};

export const generateEvents = (count) => {
  return new Array(count).fill(``).map(generateEvent);
};
