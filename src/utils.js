export const createTripTypeTitle = (eventTypes, eventName) => {
  const [foundedEvent] = eventTypes.filter((event) => event.name === eventName);
  return foundedEvent.type === `stop` ? `${foundedEvent.title} in` : `${foundedEvent.title} to`;
};

