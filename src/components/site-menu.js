import AbstractComponent from "./abstract-component.js";

const createSiteMenuTemplate = () => {
  return (`<nav class="trip-controls__trip-tabs  trip-tabs">
        <a id="btn__table" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
        <a id="btn__statistics" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`);
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem(menuItem) {
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    items.forEach((item) => {
      if (item.id === menuItem) {
        item.classList.add(`trip-tabs__btn--active`);
      } else {
        item.classList.remove(`trip-tabs__btn--active`);
      }
    });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.id;
      handler(menuItem);
    });
  }
}
