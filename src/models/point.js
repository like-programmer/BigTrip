export default class Point {
  constructor(data) {
    this.basePrice = data[`base_price`];
    this.dateFrom = data[`date_from`];
    this.dateTo = data[`date_to`];
    this.destination = data[`destination`];
    this.id = data[`id`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      "base_price": this.basePrice,
      "date_from": this.dateFrom,
      "date_to": this.dateTo,
      "destination": {
        "description": this.destination.description,
        "name": this.destination.name,
        "pictures": this.destination.pictures,
      },
      "id": this.id,
      "is_favorite": this.isFavorite,
      "offers": this.offers,
      "type": this.type,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
