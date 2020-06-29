export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.basePrice = data[`base_price`];
    this.dateFrom = data[`date_from`];
    this.dateTo = data[`date_to`];
    this.destination = data[`destination`];
    this.isFavourite = Boolean(data[`is_favourite`]);
    this.offers = data[`offers`];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      "id": this.id,
      "base_price": this.basePrice,
      "date_from": this.dateFrom,
      "date_to": this.dateTo,
      "destination": this.destination,
      "is_favourite": this.isFavourite,
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
