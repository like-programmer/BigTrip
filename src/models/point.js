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

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }
}
