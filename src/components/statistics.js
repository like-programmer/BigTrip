import AbstractSmartComponent from "./abstract-smart-component.js";

const createTestText = () => {
  return (`<h1>This is a statistics!</h1>`);
};

export default class Statictics extends AbstractSmartComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createTestText();
  }

  show() {
    super.show();
  }
}
